import express from "express";

const router = express.Router();

router.get("/analytics", (req, res) => {
  res.json({ message: "Analytics data placeholder" });
});

export default router;
