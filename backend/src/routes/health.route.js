import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    replicaId: process.env.REPLICA_ID || "unknown",
    timestamp: new Date().toISOString(),
  });
});

export default router;
