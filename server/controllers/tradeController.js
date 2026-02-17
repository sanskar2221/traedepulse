const Trade = require("../models/Trade");

// CREATE TRADE
exports.createTrade = async (req, res) => {
  try {
    const { coin, type, amount, price } = req.body;

    const trade = await Trade.create({
      user: req.user.id,
      coin,
      type,
      amount,
      price,
    });

    res.status(201).json(trade);
  } catch (err) {
    res.status(500).json({ message: "Error creating trade" });
  }
};

// GET ALL TRADES (for logged-in user)
exports.getTrades = async (req, res) => {
  try {
    const { search, type } = req.query;

    let query = { user: req.user.id };

    if (search) {
      query.coin = { $regex: search, $options: "i" };
    }

    if (type) {
      query.type = type;
    }

    const trades = await Trade.find(query).sort({ createdAt: -1 });

    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE TRADE
exports.updateTrade = async (req, res) => {
  try {
    const trade = await Trade.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!trade)
      return res.status(404).json({ message: "Trade not found" });

    res.json(trade);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE TRADE
exports.deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!trade)
      return res.status(404).json({ message: "Trade not found" });

    res.json({ message: "Trade deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
