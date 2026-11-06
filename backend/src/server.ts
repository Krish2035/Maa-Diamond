import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/index.js";
import { timeoutMiddleware } from "./middleware/timeout.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/auth.routes.js";
import diamondsRoutes from "./routes/diamonds.routes.js";
import inquiriesRoutes from "./routes/inquiries.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import vcardRoutes from "./routes/vcard.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import { initPostgresDatabase, isPostgresActive } from "./db/postgres.js";

const app = express();

// Security Middlewares (Pillars 74-77)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Idempotency-Key"],
  })
);

// Payload size limit & Body Parser
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Latency & Timeout SLA envelope (Pillar 11)
app.use(timeoutMiddleware(6000));

// Rate Limiting (Pillar 1)
app.use("/api/", apiLimiter);

// Root API Status Endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ONLINE",
    service: "Maa Diamond Enterprise Backend API",
    message: "💎 Maa Diamond API is online and running successfully.",
    database: isPostgresActive() ? "Connected (PostgreSQL / Neon)" : "Active (Synchronized)",
    endpoints: {
      health: "/api/health",
      diamonds: "/api/diamonds",
      auth: "/api/auth/login",
      inquiries: "/api/inquiries",
    },
    timestamp: new Date().toISOString(),
  });
});

// Health Check Probe (Pillar 56)
app.get("/api/health", (req: Request, res: Response) => {
  const memory = process.memoryUsage();
  res.json({
    status: "HEALTHY",
    service: "Maa Diamond Enterprise Backend",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
    },
  });
});

// Mount Module Routes
app.use("/api/auth", authRoutes);
app.use("/api/diamonds", diamondsRoutes);
app.use("/api/inquiries", inquiriesRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/vcard", vcardRoutes);
app.use("/api/stats", statsRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Global Error Handler (Pillar 91-94)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Server Exception:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error occurred.",
    timestamp: new Date().toISOString(),
  });
});

// Start Server with PostgreSQL & Fallback initialization
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";
const server = app.listen(config.port, host, async () => {
  console.log(`💎 Maa Diamond Backend API online on http://${host}:${config.port} [ENV: ${config.nodeEnv}]`);
  console.log(`📡 Health Check probe available at http://${host}:${config.port}/api/health`);
  await initPostgresDatabase().catch((err) => console.warn("Postgres init error:", err));
});

export default app;

