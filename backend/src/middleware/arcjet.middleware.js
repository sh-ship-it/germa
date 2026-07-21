import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    // Diagnostic logging — shows in Render logs
    if (decision.isDenied()) {
      console.warn("[ARCJET DENIED]", {
        ip: req.ip,
        path: req.path,
        userAgent: req.headers["user-agent"],
        reason: decision.reason,
        conclusion: decision.conclusion,
      });

      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res.status(403).json({
          message: "Access denied by security policy.",
        });
      }
    }

    // check for spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      console.warn("[ARCJET SPOOFED BOT]", {
        ip: req.ip,
        path: req.path,
        userAgent: req.headers["user-agent"],
      });
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next(); // fail open — don't block the request if Arcjet itself errors
  }
};