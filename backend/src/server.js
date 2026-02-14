import express from 'express';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from "./lib/env.js";

const app = express();
const PORT = ENV.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());

// ✅ API ROUTES FIRST
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ SERVE FRONTEND AFTER API ROUTES
if (ENV.NODE_ENV === 'production') {

    const frontendPath = path.join(__dirname, 'frontend', 'dist');

    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });

}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
