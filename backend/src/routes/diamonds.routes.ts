import { Router, Request, Response } from "express";
import { StorageEngine } from "../db/storage.js";
import {
  isPostgresActive,
  pgGetDiamonds,
  pgGetDiamondById,
  pgCreateDiamond,
  pgUpdateDiamond,
  pgDeleteDiamond,
} from "../db/postgres.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { DiamondShape } from "../types/index.js";

const router = Router();
const storage = StorageEngine.getInstance();

// GET /api/diamonds - public catalog with 4Cs filters & search
router.get("/", async (req: Request, res: Response) => {
  try {
    const { shape, minCarat, maxCarat, color, clarity, search, featured } = req.query;

    if (isPostgresActive()) {
      const result = await pgGetDiamonds({
        shape: shape as string,
        minCarat: minCarat ? parseFloat(minCarat as string) : undefined,
        maxCarat: maxCarat ? parseFloat(maxCarat as string) : undefined,
        color: color as string,
        clarity: clarity as string,
        search: search as string,
        featuredOnly: featured === "true",
      });
      res.json(result);
      return;
    }

    const diamonds = storage.getDiamonds({
      shape: shape as string,
      minCarat: minCarat ? parseFloat(minCarat as string) : undefined,
      maxCarat: maxCarat ? parseFloat(maxCarat as string) : undefined,
      color: color as string,
      clarity: clarity as string,
      search: search as string,
      featuredOnly: featured === "true",
    });

    res.json({
      total: diamonds.length,
      diamonds,
    });
  } catch (err: any) {
    console.error("Error fetching diamonds:", err);
    res.status(500).json({ error: "Failed to fetch diamonds from database." });
  }
});

// GET /api/diamonds/:id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (isPostgresActive()) {
      const diamond = await pgGetDiamondById(id);
      if (!diamond) {
        res.status(404).json({ error: "Diamond not found in database." });
        return;
      }
      res.json({ diamond });
      return;
    }

    const diamond = storage.getDiamondById(id);
    if (!diamond) {
      res.status(404).json({ error: "Diamond not found." });
      return;
    }
    res.json({ diamond });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve diamond." });
  }
});

// POST /api/diamonds - Admin Only (Create Diamond in Database)
router.post(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        stockNumber,
        shape,
        carat,
        color,
        clarity,
        cut,
        polish,
        symmetry,
        fluorescence,
        lab,
        certificateNo,
        dimensions,
        pricePerCarat,
        totalPrice,
        isAvailable,
        isFeatured,
        imageUrl,
        description,
      } = req.body;

      if (!stockNumber || !shape || !carat || !color || !clarity) {
        res.status(400).json({ error: "Stock number, shape, carat, color and clarity are required." });
        return;
      }

      const calculatedTotalPrice = totalPrice || Number((carat * (pricePerCarat || 5000)).toFixed(2));

      const diamondPayload = {
        stockNumber,
        shape: shape as DiamondShape,
        carat: Number(carat),
        color,
        clarity,
        cut: cut || "Excellent",
        polish: polish || "Excellent",
        symmetry: symmetry || "Excellent",
        fluorescence: fluorescence || "None",
        lab: lab || "GIA",
        certificateNo: certificateNo || `MD-${Date.now().toString().slice(-6)}`,
        dimensions: dimensions || "N/A",
        pricePerCarat: Number(pricePerCarat || 5000),
        totalPrice: calculatedTotalPrice,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
        description: description || `Premium ${carat} Carat ${shape} Cut Diamond.`,
      };

      if (isPostgresActive()) {
        const newDiamond = await pgCreateDiamond(diamondPayload);
        res.status(201).json({
          message: "Diamond stone created in PostgreSQL database successfully.",
          diamond: newDiamond,
        });
        return;
      }

      const newDiamond = storage.createDiamond(diamondPayload);

      res.status(201).json({
        message: "Diamond stone created successfully.",
        diamond: newDiamond,
      });
    } catch (err: any) {
      console.error("Error creating diamond:", err);
      res.status(500).json({ error: "Failed to create diamond in database." });
    }
  }
);

// PUT /api/diamonds/:id - Admin Only (Update Diamond in Database)
router.put(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (isPostgresActive()) {
        const updated = await pgUpdateDiamond(id, req.body);
        if (!updated) {
          res.status(404).json({ error: "Diamond not found in database." });
          return;
        }
        res.json({
          message: "Diamond stone updated in PostgreSQL database successfully.",
          diamond: updated,
        });
        return;
      }

      const updated = storage.updateDiamond(id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Diamond not found in database." });
        return;
      }
      res.json({
        message: "Diamond stone updated successfully.",
        diamond: updated,
      });
    } catch (err: any) {
      console.error("Error updating diamond:", err);
      res.status(500).json({ error: "Failed to update diamond in database." });
    }
  }
);

// DELETE /api/diamonds/:id - Admin Only (Delete Diamond from Database)
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (isPostgresActive()) {
        const success = await pgDeleteDiamond(id);
        if (!success) {
          res.status(404).json({ error: "Diamond not found in database." });
          return;
        }
        res.json({ message: "Diamond removed from PostgreSQL database." });
        return;
      }

      const success = storage.deleteDiamond(id);
      if (!success) {
        res.status(404).json({ error: "Diamond not found." });
        return;
      }
      res.json({ message: "Diamond removed from inventory database." });
    } catch (err: any) {
      console.error("Error deleting diamond:", err);
      res.status(500).json({ error: "Failed to delete diamond from database." });
    }
  }
);

export default router;
