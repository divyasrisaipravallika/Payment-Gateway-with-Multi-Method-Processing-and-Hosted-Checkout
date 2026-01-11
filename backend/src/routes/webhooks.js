const express = require("express");
const router = express.Router();

router.post("/payment", (req, res) => {
  console.log("WEBHOOK RECEIVED:", req.body);
  res.json({ received: true });
});

module.exports = router;
