<div align="center">

# 🧊 Polar Science Portal

### A Unified Digital Ecosystem for India's Polar Science Outreach, Research & Media

**Smart India Hackathon 2026 · SIH26063**
**Proposed by:** Ministry of Earth Sciences (MoES), Government of India

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://www.postgresql.org/)
[![Meilisearch](https://img.shields.io/badge/Search-Meilisearch-FF5CAA)](https://www.meilisearch.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## 🌍 Overview

The **Polar Science Portal** connects India's polar science research, public outreach, and multimedia dissemination into a single accessible platform. It brings together India's expeditions to **Antarctica, the Arctic, and the Himalayas** — making cutting-edge climate and ecology research discoverable to researchers, students, educators, and the public.

> Built as a production-grade, publicly deployable government science portal — not a demo.

---

## 🎯 Core Objectives

| Pillar | Purpose | Highlights |
|---|---|---|
| 🌐 **Outreach** | Educate the public & students on India's polar expeditions | Interactive 3D globe, station maps, gamified learning modules |
| 📚 **Knowledge Repository** | Centralized searchable research database | Full-text search, geospatial metadata, secure document access |
| 🎥 **Media Dissemination** | Organize and stream polar multimedia | Galleries, documentaries, press releases, live station feeds |

---

## ✨ Key Features

- 🌎 **Interactive 3D Globe** — rotate, zoom, and click research stations (Bharati, Maitri, Himadri)
- 🗺️ **Geospatial Mapping** — expedition routes & ice-sheet overlays via Mapbox GL
- 🎓 **Gamified Learning Modules** — infographics, quizzes, and progress tracking
- 🔍 **Lightning-Fast Search** — Meilisearch-powered full-text search across the research repository
- 📤 **Secure Research Uploads** — pre-signed S3 uploads with metadata tagging
- 🖼️ **Media Gallery** — high-res photography, documentaries, and press content via CDN
- 🔐 **Role-Based Access Control** — Public, Researcher, Educator, and Admin roles
- 🛠️ **Admin Dashboard** — content moderation, analytics, and publishing tools
- ♿ **WCAG 2.1 AA Accessible** — built for every citizen, on every device

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph Users
        A[Public] 
        B[Students]
        C[Educators]
        D[Researchers]
        E[Admins]
    end

    subgraph WebApp["Web Application — Next.js + Tailwind"]
        F[3D Globe / Mapbox]
        G[Search UI]
        H[Learning Modules]
        I[Media Gallery]
    end

    subgraph API["API & Data Services"]
        J[Node.js + Express]
        K[Auth & RBAC]
        L[Repository APIs]
        M[Search APIs]
        N[Optional FastAPI Microservice]
    end

    subgraph Storage["Storage & Delivery"]
        O[(PostgreSQL)]
        P[(Meilisearch)]
        Q[(Object Storage - S3)]
        R[CDN - Cloudflare]
    end

    Users --> WebApp --> API --> Storage
    Storage --> R --> Users
```

---

## 🧰 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS | SSR for SEO, fast responsive UI |
| **3D / Maps** | Three.js, `@react-three/fiber`, Mapbox GL JS | Interactive globe & geospatial visualization |
| **Backend** | Node.js + Express.js | Scalable REST APIs, auth, high concurrency |
| **Scientific Layer** | Python + FastAPI *(optional)* | Geospatial data processing, future AI/ML modules |
| **Database** | PostgreSQL 15 | Reliable structured storage |
| **Search Engine** | Meilisearch | Fast full-text search across the repository |
| **Media Storage** | AWS S3 / Cloudinary | Scalable object storage for PDFs, images, video |
| **CDN** | Cloudflare / AWS CloudFront | Global low-latency content delivery |

---

## 📁 Page Structure

```
/                       → Homepage with 3D globe & mission overview
/explore                → Interactive globe + Mapbox geospatial layer
/expeditions            → Expedition listing        [slug] → detail page
/stations               → Research station directory [slug] → detail page
/learn                  → Learning modules catalog    [moduleSlug] → lesson
/repository             → Knowledge repository search & browse
/repository/[id]        → Document detail + secure download
/repository/upload      → Researcher upload form (auth-protected)
/media                  → Media gallery grid
/media/[itemId]         → Media detail / lightbox / player
/press                  → Press release listing & detail
/about                  → About MoES & the platform
/login, /register       → Authentication & role selection
/dashboard              → User dashboard (uploads, progress, saved docs)
/admin                  → Admin moderation, analytics & CMS
/404, /500               → Custom themed error pages
```

---

## 🔄 Core User Flows

1. **Explorer** → lands on homepage → interacts with 3D globe → clicks station → views expedition reports
2. **Learner** → browses `/learn` → completes gamified module → progress tracked if logged in
3. **Researcher** → logs in → uploads paper via pre-signed S3 URL → metadata indexed in Meilisearch
4. **Any user** → searches repository → filters by type/year/region → downloads via time-limited secure link
5. **Admin** → reviews pending uploads → approves/rejects → publishes press releases → monitors analytics

---

## 🔐 Roles & Permissions

| Role | Access |
|---|---|
| **Public** | Browse & search public content, read-only |
| **Researcher** | Upload datasets/papers, access gated downloads |
| **Educator** | Access learning modules & classroom tools |
| **Admin** | Full content management, moderation, publishing, analytics |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18
- Docker & Docker Compose (recommended for local PostgreSQL + Meilisearch)
- AWS S3 bucket (or Cloudinary account)
- Mapbox API token

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-org>/polar-science-portal.git
cd polar-science-portal

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start PostgreSQL + Meilisearch locally
docker-compose up -d

# Run database migrations
npm run migrate

# Seed sample data (expeditions, stations, documents, media)
npm run seed

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/polar_portal
JWT_SECRET=your_jwt_secret
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your_meilisearch_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=polar-portal-media
MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

---

## 🗂️ Project Structure

```
polar-science-portal/
├── apps/
│   ├── web/                # Next.js frontend
│   └── api/                 # Express backend
├── services/
│   └── scientific-api/      # Optional FastAPI microservice
├── features/
│   ├── repository/
│   ├── media/
│   ├── expeditions/
│   ├── learning/
│   └── admin/
├── migrations/               # Versioned DB migrations
├── seed/                     # Sample seed data
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🛡️ Security & Compliance

- 🔒 JWT authentication with HttpOnly secure cookies
- 🕒 Pre-signed S3 URLs expire within 15 minutes
- ✅ Server-side input validation on every endpoint
- 📜 Full audit logging for all admin actions
- ♿ WCAG 2.1 AA accessibility compliant
- 🚫 No client-side role checks — all authorization enforced server-side

---

## 🚧 Roadmap

- [ ] Live HLS video feed integration from polar research stations
- [ ] AI-assisted document summarization (FastAPI + ML layer)
- [ ] Multilingual support for outreach content
- [ ] Public API for third-party researchers

---

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss proposed changes before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

**Built for Smart India Hackathon 2026** · Ministry of Earth Sciences 🇮🇳

</div>

  
 