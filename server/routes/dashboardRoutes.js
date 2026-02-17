const express = require("express");
const router = express.Router();
const Trade = require("../models/Trade");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id });

    const totalTrades = trades.length;

    const totalBalance = trades.reduce((sum, trade) => {
      return sum + trade.amount * trade.price;
    }, 0);

    const recentTrades = trades
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      totalTrades,
      totalBalance,
      recentTrades
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
