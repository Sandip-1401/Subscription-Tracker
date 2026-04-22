import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
   windowMs: 1000 * 60 * 15,
   max: 100,
   message: {
      success: false,
      status: 429,
      error: "Too many requests from this IP, please try again after 15 minutes"
   }
})