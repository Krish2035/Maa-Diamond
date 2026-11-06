import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StorageEngine } from "../db/storage.js";
import { isPostgresActive, pgFindUserByEmail, pgFindUserById, pgCreateUser } from "../db/postgres.js";
import { config } from "../config/index.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
const storage = StorageEngine.getInstance();

// POST /api/auth/login
router.post("/login", authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = isPostgresActive()
      ? await pgFindUserByEmail(email)
      : storage.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password credentials." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password credentials." });
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "7d",
    } as any);

    res.json({
      message: "Authentication successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        phone: user.phone,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Internal authentication error." });
  }
});

// POST /api/auth/register (Client registration)
router.post("/register", authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, companyName, phone } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Name, email and password are required fields." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters in length." });
      return;
    }

    const existing = isPostgresActive()
      ? await pgFindUserByEmail(email)
      : storage.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userPayload = {
      email,
      passwordHash,
      name,
      companyName: companyName || "",
      phone: phone || "",
      role: "USER" as const,
    };

    const newUser = isPostgresActive()
      ? await pgCreateUser(userPayload)
      : storage.createUser(userPayload);

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
      config.jwtSecret,
      { expiresIn: "7d" } as any
    );

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        companyName: newUser.companyName,
        phone: newUser.phone,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create user account." });
  }
});

// GET /api/auth/me
router.get("/me", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = isPostgresActive()
    ? await pgFindUserById(req.user!.id)
    : storage.findUserById(req.user!.id);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      phone: user.phone,
    },
  });
});

export default router;
