// src/routes/transactions.js
import express from "express";

const router = express.Router();

router.get("/:reference", (req, res) => {
  res.json({ message: "Transaction details coming soon." });
});

export default router;
