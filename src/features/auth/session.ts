/**
 * Demo session layer.
 *
 * The production design (see docs/ARCHITECTURE.md) issues a short-lived JWT
 * access token plus a rotating refresh cookie from the Express API and keeps
 * role claims server-side. Until that API is attached, this module simulates
 * the same shape entirely in the browser so the UI can be exercised. No
 * secrets, tokens or credentials are stored here.
 */

export type Role = "public" | "researcher" | "curator" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  institution: string;
  orcid?: string;
}

const STORAGE_KEY = "moes-polar-demo-session";

export const demoAccounts: (SessionUser & { hint: string })[] = [
  {
    id: "u-researcher",
    name: "Dr. Anirban Sen",
    email: "a.sen@ncpor.res.in",
    role: "researcher",
    institution: "NCPOR, Goa",
    orcid: "0000-0002-1825-0097",
    hint: "Submit datasets, track review status, request restricted data",
  },
  {
    id: "u-curator",
    name: "Rukmini Das",
    email: "r.das@ncpor.res.in",
    role: "curator",
    institution: "NCPOR Data Centre",
    hint: "Review submissions, mint DOIs, manage metadata quality",
  },
  {
    id: "u-admin",
    name: "Portal Administrator",
    email: "admin@polar.moes.gov.in",
    role: "admin",
    institution: "Ministry of Earth Sciences",
    hint: "Full access including users, roles and audit log",
  },
];

export const rolePermissions: Record<Role, string[]> = {
  public: ["dataset:read:open", "learning:read", "media:read"],
  researcher: [
    "dataset:read:open",
    "dataset:read:registered",
    "dataset:create",
    "dataset:update:own",
    "access-request:create",
    "learning:read",
    "media:read",
  ],
  curator: [
    "dataset:read:*",
    "dataset:review",
    "dataset:publish",
    "doi:mint",
    "access-request:decide",
    "media:manage",
  ],
  admin: ["*"],
};

export function can(role: Role, permission: string): boolean {
  const grants = rolePermissions[role];
  return grants.some((g) => {
    if (g === "*" || g === permission) return true;
    if (g.endsWith(":*")) return permission.startsWith(g.slice(0, -1));
    return false;
  });
}

export function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function writeSession(user: SessionUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("moes-session-change"));
}
