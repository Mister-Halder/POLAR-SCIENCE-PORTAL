-- India PolaRis — Postgres schema (migration 0001).
-- Roles live in a dedicated table, never on the user profile, to prevent
-- privilege escalation through profile writes.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE app_role AS ENUM ('public', 'researcher', 'curator', 'admin');
CREATE TYPE access_level AS ENUM ('open', 'registered', 'restricted');
CREATE TYPE submission_state AS ENUM ('draft','submitted','in_review','changes_requested','published','withdrawn');

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         citext UNIQUE NOT NULL,
  full_name     text NOT NULL,
  institution   text NOT NULL,
  orcid         text,
  password_hash text NOT NULL,           -- argon2id
  verified_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role    app_role NOT NULL,
  granted_by uuid REFERENCES users(id),
  granted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE refresh_tokens (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,              -- sha256 of the opaque token
  family     uuid NOT NULL,              -- rotation family, for reuse detection
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz
);

CREATE TABLE expeditions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text UNIQUE NOT NULL,
  slug        text UNIQUE NOT NULL,
  title       text NOT NULL,
  region      text NOT NULL,
  season      text NOT NULL,
  start_date  date NOT NULL,
  end_date    date NOT NULL,
  status      text NOT NULL,
  vessel      text,
  basecamp    text,
  lat         double precision,
  lon         double precision,
  participants integer NOT NULL DEFAULT 0,
  summary     text NOT NULL
);

CREATE TABLE datasets (
  id             text PRIMARY KEY,
  doi            text UNIQUE,
  title          text NOT NULL,
  abstract       text NOT NULL,
  theme          text NOT NULL,
  region         text NOT NULL,
  region_group   text NOT NULL,
  expedition_id  uuid REFERENCES expeditions(id),
  pi_user_id     uuid REFERENCES users(id),
  license        text NOT NULL,
  access         access_level NOT NULL DEFAULT 'open',
  version        text NOT NULL DEFAULT 'v1.0',
  temporal_start date,
  temporal_end   date,
  bbox           numeric[4],
  keywords       text[] NOT NULL DEFAULT '{}',
  variables      text[] NOT NULL DEFAULT '{}',
  published_at   timestamptz,
  downloads      integer NOT NULL DEFAULT 0,
  citations      integer NOT NULL DEFAULT 0
);

CREATE INDEX datasets_theme_idx  ON datasets (theme);
CREATE INDEX datasets_access_idx ON datasets (access);
CREATE INDEX datasets_search_idx ON datasets USING gin (to_tsvector('english', title || ' ' || abstract));

CREATE TABLE dataset_files (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id   text NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  file_name    text NOT NULL,
  object_key   text NOT NULL UNIQUE,
  format       text NOT NULL,
  size_bytes   bigint NOT NULL,
  checksum_sha256 text NOT NULL,
  uploaded_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE submissions (
  id           text PRIMARY KEY,
  dataset_id   text REFERENCES datasets(id),
  submitter_id uuid NOT NULL REFERENCES users(id),
  curator_id   uuid REFERENCES users(id),
  state        submission_state NOT NULL DEFAULT 'draft',
  reviewer_note text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE access_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id  text NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose     text NOT NULL,
  state       text NOT NULL DEFAULT 'pending',
  decided_by  uuid REFERENCES users(id),
  decided_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE download_events (
  id         bigserial PRIMARY KEY,
  dataset_id text NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES users(id),
  file_name  text NOT NULL,
  at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id      bigserial PRIMARY KEY,
  actor   text NOT NULL,
  action  text NOT NULL,
  target  text,
  detail  jsonb,
  at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE learning_modules (
  slug     text PRIMARY KEY,
  title    text NOT NULL,
  level    text NOT NULL,
  minutes  integer NOT NULL,
  audience text NOT NULL,
  summary  text NOT NULL,
  body     jsonb NOT NULL,
  quiz     jsonb NOT NULL
);

CREATE TABLE media_items (
  id          text PRIMARY KEY,
  kind        text NOT NULL,
  title       text NOT NULL,
  credit      text NOT NULL,
  captured_on date,
  location    text,
  expedition_id uuid REFERENCES expeditions(id),
  description text NOT NULL,
  tags        text[] NOT NULL DEFAULT '{}',
  license     text NOT NULL,
  object_key  text
);
