import { Router, Request, Response } from "express";
import { StorageEngine } from "../db/storage.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = Router();
const storage = StorageEngine.getInstance();

// GET /api/stats - Admin Only
router.get(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  (req: Request, res: Response) => {
    const stats = storage.getStats();
    res.json({ stats });
  }
);

export default router;

