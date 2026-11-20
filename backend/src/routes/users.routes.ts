import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { StorageEngine } from "../db/storage.js";
import {
  isPostgresActive,
  pgGetAllUsers,
  pgFindUserByEmail,
  pgFindUserById,
  pgCreateUser,
  pgUpdateUser,
  pgDeleteUser,
} from "../db/postgres.js";
import { User, UserRole } from "../types/index.js";

const router = Router();
const storage = StorageEngine.getInstance();

// Safe user mapper (removes passwordHash)
function sanitizeUser(u: User) {
  const { passwordHash, ...rest } = u as any;
  return rest;
}

// GET /api/users - List all users
router.get("/", async (req: Request, res: Response) => {
  try {
    let users: User[] = [];
    if (isPostgresActive()) {
      users = await pgGetAllUsers();
    } else {
      users = storage.getAllUsers();
    }
    res.json({
      total: users.length,
      users: users.map(sanitizeUser),
    });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users from database." });
  }
});

// POST /api/users - Create new user with specified role (Admin)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role, companyName, phone } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Name, email, and password are required fields." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters in length." });
      return;
    }

    const assignedRole: UserRole = role === "ADMIN" ? "ADMIN" : "USER";

    const existing = isPostgresActive()
      ? await pgFindUserByEmail(email)
      : storage.findUserByEmail(email);

    if (existing) {
      res.status(409).json({ error: "A user account with this email already exists." });
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
      role: assignedRole,
    };

    const newUser = isPostgresActive()
      ? await pgCreateUser(userPayload)
      : storage.createUser(userPayload);

    res.status(201).json({
      message: `User account "${newUser.name}" created successfully as ${newUser.role}.`,
      user: sanitizeUser(newUser),
    });
  } catch (err: any) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user account." });
  }
});

// PUT /api/users/:id - Update user details or switch role (ADMIN <-> USER)
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, email, role, companyName, phone, password } = req.body;

    const existing = isPostgresActive()
      ? await pgFindUserById(id)
      : storage.findUserById(id);

    if (!existing) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const updates: Partial<User> = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) {
      if (role !== "ADMIN" && role !== "USER") {
        res.status(400).json({ error: "Role must be either 'ADMIN' or 'USER'." });
        return;
      }
      updates.role = role;
    }
    if (companyName !== undefined) updates.companyName = companyName;
    if (phone !== undefined) updates.phone = phone;

    if (password) {
      if (password.length < 6) {
        res.status(400).json({ error: "Password must be at least 6 characters in length." });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = isPostgresActive()
      ? await pgUpdateUser(id, updates)
      : storage.updateUser(id, updates);

    if (!updatedUser) {
      res.status(500).json({ error: "Failed to update user in database." });
      return;
    }

    res.json({
      message: `User "${updatedUser.name}" updated successfully. Role: ${updatedUser.role}.`,
      user: sanitizeUser(updatedUser),
    });
  } catch (err: any) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user." });
  }
});

// DELETE /api/users/:id - Delete user account
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const existing = isPostgresActive()
      ? await pgFindUserById(id)
      : storage.findUserById(id);

    if (!existing) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Safeguard: cannot delete primary admin
    if (existing.email === "admin@maadiamond.com") {
      res.status(403).json({ error: "Primary system administrator account cannot be deleted." });
      return;
    }

    const success = isPostgresActive()
      ? await pgDeleteUser(id)
      : storage.deleteUser(id);

    if (!success) {
      res.status(500).json({ error: "Failed to delete user." });
      return;
    }

    res.json({
      message: `User account "${existing.name}" (${existing.email}) deleted successfully.`,
      success: true,
    });
  } catch (err: any) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user account." });
  }
});

export default router;
