import { Request, Response, NextFunction } from "express";

// Pillar 11 (Strict Query & Execution Timeouts)
export const timeoutMiddleware = (timeoutMs: number = 5000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          error: "Gateway Timeout. The request exceeded the server latency SLA envelope.",
        });
      }
    }, timeoutMs);

    res.on("finish", () => clearTimeout(timer));
    res.on("close", () => clearTimeout(timer));

    next();
  };
};

