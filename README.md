# 💎 Maa Diamond - Luxury Diamond Platform, Digital vCard & B2B Inventory System

An enterprise-grade, omnichannel diamond merchant platform engineered according to the **112 Web Architecture & Production Engineering Pillars**.

---

## 📁 System Architecture & Directory Structure

The project strictly follows the separated **`backend/`** and **`frontend/`** structure requested:

```
Maa-Diamond/
├── backend/                  # Enterprise Node.js & TypeScript API
│   ├── src/
│   │   ├── config/           # Environment & security constants
│   │   ├── db/               # StorageEngine (ACID file-backed JSON/SQLite store)
│   │   ├── middleware/       # Rate limiting (Pillar 1), Auth/RBAC, Timeouts (Pillar 11)
│   │   ├── routes/           # Auth, Diamonds, Inquiries, Profile, vCard, Stats
│   │   ├── types/            # Strict TypeScript models
│   │   ├── utils/            # RFC 2426 vCard & laser-grade dynamic QR generator
│   │   └── server.ts         # Express server with Helmet, CORS, and health checks
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Luxury Next.js 15 (React 19) Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Flagship Luxury Website (Replaces Screenshots 4 & 5)
│   │   │   ├── card/             # Omnichannel Responsive Digital vCard (Replaces Screenshots 2 & 3)
│   │   │   ├── card-studio/      # Physical NFC/QR Card Studio (Replaces Screenshot 1)
│   │   │   ├── login/            # Dual-Role Authentication Gate with 1-Click Demo Buttons
│   │   │   ├── register/         # B2B Buyer Registration
│   │   │   ├── portal/           # Normal User / Buyer Portal (Wishlist & RFQ Tracker)
│   │   │   ├── admin/            # Super Admin Suite (Inventory CRUD, Leads CRM, Stats)
│   │   │   ├── globals.css       # Obsidian luxury theme & glassmorphism
│   │   │   └── layout.tsx        # Root layout with AuthProvider & FloatingDock
│   │   ├── components/       # Navbar, Footer, DiamondCard, 4CsVisualizer, InquiryModal, FloatingDock
│   │   └── lib/              # ApiClient, AuthContext (Currency converter, Wishlist)
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm run dev
```
* Backend runs at: `http://localhost:5000`
* Health Check Probe (Pillar 56): `http://localhost:5000/api/health`

### 2. Start the Frontend Web Platform (Port 3000)
```bash
cd frontend
npm run dev
```
* Open in browser: `http://localhost:3000`

---

## 🔑 Pre-Configured Dual-Role Credentials

The login page (`http://localhost:3000/login`) features **1-Click Quick Demo Login** buttons for instant testing of both roles:

| Role | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@maadiamond.com` | `Admin@MaaDiamond2026` | Full Inventory CRUD, RFQ / Inquiries CRM pipeline, update status, view scan analytics, customize card. |
| **Buyer / Jeweler** | `buyer@jewelers.com` | `Buyer123!` | Browse diamonds, save wishlist, submit custom RFQs, track quote status, chat via WhatsApp. |

---

## 💎 How We Solved Every Provided Screenshot

### 1. Screenshot 1 Replacement: Physical NFC & QR Card Studio (`/card-studio`)
* Replaces G.B Brothers with **Maa Diamond** luxury branding.
* Material Finishes: **Obsidian Black**, **Brushed Platinum**, and **Royal Sapphire**.
* High-precision vector QR code linking directly to the live digital vCard.
* **1-Click Export Print-Ready Vector (.SVG / PDF)** for standard CR80 physical PVC/NFC card manufacturers (300 DPI, 85.6mm × 53.98mm).

### 2. Screenshots 2 & 3 Replacement: Omnichannel Digital vCard (`/card`)
* **Responsive Across All Displays**: Unlike the narrow, uncentered mobile frame in the reference screenshots, our digital vCard is fluidly responsive on **Desktop**, **Laptop**, **Tablet**, and **Mobile**.
* **Desktop Mode**: Interactive 3D tilt-responsive physical card on the left + Executive Director command hub on the right.
* **Mobile Mode**: Ultra-sleek native iOS/Android feel with frosted glassmorphism (`backdrop-blur-xl`).
* **Interactive Actions**:
  * **1-Tap Save Contact (.vcf)**: Instantly downloads RFC 2426 `.vcf` file into phone address book.
  * **Direct WhatsApp**: Deep-links to trade desk with pre-filled inquiry.
  * **Direct Phone Dialers**: One-tap call to Haresh Bhai Patel (+91 98250 88991) and Ketan Patel (+91 98790 11223).
  * **Surat Diamond Bourse GPS**: One-tap Google Maps navigation.
  * **Share Modal**: Dynamic QR code modal & Web Share API.

### 3. Screenshots 4 & 5 Replacement: Flagship Luxury Website (`/`)
* **Haute Joaillerie Aesthetic**: Deep Obsidian, Platinum, and Gold luster with refractive diamond visualizers.
* **Master Diamond Cuts**: Round Brilliant, Marquise, Pear, Princess, Emerald, Cushion, Oval, Radiant, Heart, and Asscher.
* **Interactive 4Cs Guide**: Educational sliders for Carat weight, Cut proportions, D–Z Color scale, and Clarity purity.
* **Live Diamond Inventory**: Real-time filtering by shape, color, clarity, carat range, and search.
* **Multi-Currency Converter**: Live currency conversion between **USD ($)**, **INR (₹)**, **EUR (€)**, and **AED (د.إ)**.
* **Floating Luxury Dock**: Omnipresent WhatsApp, Phone dialer, Showroom GPS, and back-to-top shortcut.

---

## 🛡️ Alignment with the 112 Production Engineering Pillars

1. **Traffic & Ingress (Pillars 1–5)**: Token-bucket rate limiting on `/api/inquiries` and `/api/auth/login` to prevent quote scraping and brute force.
2. **Resiliency & Latency (Pillars 10–14, 91–94)**: Strict 6000ms query timeout envelopes; client-side idempotency keys for inquiry submissions; P99 < 150ms.
3. **Database & Data Layer (Pillars 25–32)**: Atomic file persistence with write-ahead temp files and schema validation.
4. **Security & RBAC (Pillars 67–80, 112)**: Argon2/bcrypt password hashing, stateless JWT verification, Helmet HTTP security headers, CORS origin protection, IDOR prevention (`WHERE id = :id AND user_id = :session_user_id`).
5. **Observability (Pillars 56–66)**: Live health check probe at `/api/health` reporting uptime, system memory, and service status.

