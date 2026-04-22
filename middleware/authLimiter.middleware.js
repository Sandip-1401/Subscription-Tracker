import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
   windowMs: 1000 * 60 * 15,
   max: 5,
   message: {
      success: false,
      status: 429,
      error: "Too many login attempts from this IP, please try again after 15 minutes"
   }
});