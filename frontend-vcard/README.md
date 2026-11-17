# Maa Diamond - Digital vCard Application (`frontend-vcard`)

This folder contains the dedicated, standalone web application for the **Maa Diamond Digital Business Card (vCard)**.

---

## 🚀 Key Features
- **Root-level vCard**: Visiting `/` immediately renders the responsive, luxury digital business card.
- **1-Tap Save Contact (.vcf)**: Generates and downloads the official `.vcf` contact file for instant phone contact sync.
- **Direct Calling**: One-tap phone call buttons for directors Hardik Sorathiya (`+91 90333 20326`) and Sanket Sorathiya (`+91 80000 45391`).
- **Direct WhatsApp Chat**: Pre-filled WhatsApp chat links to both directors.
- **Wholesale Diamond Inquiry**: Instant inquiry modal with WhatsApp forwarding.
- **Google Maps Navigation**: Direct link to the office at *217, Akshar Diamond Market, Varachha, Surat*.
- **Main Website Link**: Quick navigation button to the main Maa Diamond inventory website (`https://maa-diamond.vercel.app`).
- **Offline & SSR Resilient**: Works standalone even if backend servers are restarting.

---

## 🛠️ Local Development

```bash
cd frontend-vcard
npm install
npm run dev
```

Opens at [http://localhost:3001](http://localhost:3001).

---

## 🌐 How to Deploy to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository: `Krish2035/Maa-Diamond`.
4. In the **Root Directory** setting, click **Edit** and select:
   ```
   frontend-vcard
   ```
5. Click **Deploy**.
6. Once deployed, Vercel will give you a live URL (e.g. `https://maa-diamond-vcard.vercel.app`).
7. You can then update the QR code generator with your new standalone Vercel link!
