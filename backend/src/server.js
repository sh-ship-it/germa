import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import {ENV} from "./lib/env.js";


const app = express();
const PORT = ENV.PORT ||3000;
// const __dirname = path.resolve();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages" , messageRoutes);

// //make ready for deployment
// if(ENV.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname, '../frontend/dist')));

//     app.get('*', (_, res) => {
//         res.sendFile(path.join(__dirname, '../frontend','dist','index.html'));
//     });
// }

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (ENV.NODE_ENV === 'production') {
    // 1. Go from /backend/src -> /backend -> /germa (root)
    // 2. Then enter /frontend/dist
    const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
    
    // Serve static files
    app.use(express.static(frontendDistPath));

    // Handle SPA routing: send everything else to index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port : http://localhost:${PORT}`)
    connectDB();
}
);