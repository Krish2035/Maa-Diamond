import { Router, Request, Response } from "express";
import { StorageEngine } from "../db/storage.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = Router();
const storage = StorageEngine.getInstance();

// GET /api/profile - Public Profile for digital vCard and Website
router.get("/", (req: Request, res: Response) => {
  const profile = storage.getProfile();
  res.json({ profile });
});

// PUT /api/profile - Admin Only
router.put(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  (req: Request, res: Response): void => {
    try {
      const updated = storage.updateProfile(req.body);
      res.json({
        message: "Business profile updated successfully.",
        profile: updated,
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update business profile." });
    }
  }
);

export default router;

