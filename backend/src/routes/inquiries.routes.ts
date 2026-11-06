import { Router, Request, Response } from "express";
import { StorageEngine } from "../db/storage.js";
import { inquiryLimiter } from "../middleware/rateLimiter.js";
import { authenticateToken, requireRole, AuthenticatedRequest } from "../middleware/auth.js";
import { InquiryStatus } from "../types/index.js";

const router = Router();
const storage = StorageEngine.getInstance();

// POST /api/inquiries - Submit inquiry (Rate-limited, Idempotent)
router.post("/", inquiryLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      targetCarat,
      targetShape,
      targetBudget,
      diamondId,
      diamondStockNumber,
      notes,
      idempotencyKey,
      userId,
    } = req.body;

    if (!customerName || !customerPhone) {
      res.status(400).json({ error: "Customer name and phone number are required." });
      return;
    }

    // Pillar 14: Idempotency Check
    if (idempotencyKey) {
      const existing = storage.findInquiryByIdempotency(idempotencyKey);
      if (existing) {
        res.status(200).json({
          message: "Inquiry previously received (Idempotent replay).",
          inquiry: existing,
        });
        return;
      }
    }

    const inquiry = storage.createInquiry({
      userId: userId || undefined,
      customerName,
      customerPhone,
      customerEmail,
      status: "NEW",
      targetCarat: targetCarat ? Number(targetCarat) : undefined,
      targetShape,
      targetBudget,
      diamondId,
      diamondStockNumber,
      notes,
      idempotencyKey,
    });

    res.status(201).json({
      message: "Diamond inquiry submitted successfully. Our gemologist will contact you shortly.",
      inquiry,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to submit inquiry." });
  }
});

// GET /api/inquiries - Admin views all, Normal User views their own (Pillar 112 IDOR prevention)
router.get("/", authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;

  if (user.role === "ADMIN") {
    const inquiries = storage.getInquiries();
    res.json({ total: inquiries.length, inquiries });
    return;
  }

  // Normal User scoped to their own inquiries
  const userInquiries = storage.getInquiries(user.id);
  res.json({ total: userInquiries.length, inquiries: userInquiries });
});

// PUT /api/inquiries/:id/status - Admin Only
router.put(
  "/:id/status",
  authenticateToken,
  requireRole(["ADMIN"]),
  (req: Request, res: Response): void => {
    const { status } = req.body;
    const validStatuses: InquiryStatus[] = [
      "NEW",
      "CONTACTED",
      "QUOTED",
      "IN_NEGOTIATION",
      "CLOSED_WON",
      "CLOSED_LOST",
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = storage.updateInquiryStatus(id, status);
    if (!updated) {
      res.status(404).json({ error: "Inquiry not found." });
      return;
    }

    res.json({
      message: `Inquiry status updated to ${status}.`,
      inquiry: updated,
    });
  }
);

export default router;
