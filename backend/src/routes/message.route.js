import express from 'express';
const router = express.Router();


router.get('/send', (req, res) => {
    res.send('message sent');
});
router.get('/receive', (req, res) => {
    res.send('message received');
});



export default router;