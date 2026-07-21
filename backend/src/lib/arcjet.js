import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

import { ENV } from "./env.js";


const aj = arcjet({

  key: ENV.ARCJET_API_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    // DRY_RUN because all traffic arrives via the reverse proxy (Render internal IP),
    // so Arcjet misclassifies real browsers as HEADLESS_CHROME. Logs only, doesn't block.
    detectBot({
      mode: "DRY_RUN",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:MONITOR",       // Uptime monitoring services (Render, Pingdom, etc)
        "CATEGORY:PREVIEW",       // Link previews e.g. Slack, Discord, Vercel
      ],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    slidingWindow({
        mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
        max: 100, // Max 100 requests
        interval: 60, // Per 1 minute
    })
  ],
});

export default aj;