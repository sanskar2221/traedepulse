const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coin: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Buy", "Sell"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // 🔥 THIS IS IMPORTANT
);

module.exports = mongoose.model("Trade", tradeSchema);
