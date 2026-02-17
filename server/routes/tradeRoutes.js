const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createTrade,
  getTrades,
  updateTrade,
  deleteTrade
} = require("../controllers/tradeController");

router.use(auth);

router.post("/", createTrade);
router.get("/", getTrades);
router.put("/:id", updateTrade);
router.delete("/:id", deleteTrade);

module.exports = router;
