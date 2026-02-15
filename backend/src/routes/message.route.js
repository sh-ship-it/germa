import express from 'express';
import { getAllContatcts, getMessagesByUserId,sendMessage ,getChatpartners} from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtection,protectRoute)
router.get("/contacts" ,getAllContatcts);
router.get("/chats",getChatpartners); 
router.get("/:id",getMessagesByUserId); 
router.post("/send/:id", sendMessage);

export default router;