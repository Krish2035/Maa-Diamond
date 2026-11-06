import { Router, Request, Response } from "express";
import { StorageEngine } from "../db/storage.js";
import { generateVCard } from "../utils/vcard.js";
import { generateQRCodeDataUrl, generateQRCodeSVG } from "../utils/qr.js";

const router = Router();
const storage = StorageEngine.getInstance();

// GET /api/vcard/download - 1-Tap Save Contact to Phone (.vcf)
router.get("/download", (req: Request, res: Response) => {
  const profile = storage.getProfile();
  const vcardText = generateVCard(profile);

  res.setHeader("Content-Type", "text/vcard; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="Maa_Diamond_Contact.vcf"');
  res.send(vcardText);
});

// GET /api/vcard/qr - Dynamic QR Code generation for physical card / digital sharing
router.get("/qr", async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = storage.getProfile();
    const format = req.query.format as string; // 'svg' or 'dataurl'
    const targetUrl = (req.query.url as string) || profile.cardUrl;

    if (format === "svg") {
      const svg = await generateQRCodeSVG(targetUrl);
      res.setHeader("Content-Type", "image/svg+xml");
      res.send(svg);
      return;
    }

    const dataUrl = await generateQRCodeDataUrl(targetUrl);
    res.json({ dataUrl, targetUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code." });
  }
});

// POST /api/vcard/scan - Log QR Scan for CRM & Analytics
router.post("/scan", (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"] || "";
  let deviceType: "mobile" | "tablet" | "desktop" | "other" = "other";

  if (/mobile/i.test(userAgent)) deviceType = "mobile";
  else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";
  else if (/macintosh|windows|linux/i.test(userAgent)) deviceType = "desktop";

  const scan = storage.recordQRScan({
    ipAddress: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1",
    userAgent,
    deviceType,
  });

  res.json({ recorded: true, scanId: scan.id });
});

export default router;

