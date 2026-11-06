import rateLimit from "express-rate-limit";

// Rate limiting aligned with Pillar 1 (Traffic & Ingress Protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
});

export const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Max 30 inquiries per IP per hour to prevent quote scraping
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Inquiry submission rate limit reached. Please contact us directly via WhatsApp or Phone.",
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

