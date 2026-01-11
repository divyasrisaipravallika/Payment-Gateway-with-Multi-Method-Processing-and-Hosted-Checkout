const express = require("express");
const pool = require("../db");
const generateId = require("../utils/idGenerator");
const errorResponse = require("../utils/errors");
const {
  isValidVPA,
  luhnCheck,
  cardNetwork,
  isExpired
} = require("../services/validationService");
const {
  decideOutcome,
  processingDelay
} = require("../services/paymentService");

const router = express.Router();

/**
 * POST /api/v1/payments
 */
router.post("/", async (req, res) => {
  try {
    const { order_id, method, vpa, card } = req.body;

    if (!order_id || !method) {
      return res
        .status(400)
        .json(errorResponse("BAD_REQUEST_ERROR", "order_id and method are required"));
    }

    const order = await pool.query(
      "SELECT * FROM orders WHERE id=$1 AND merchant_id=$2",
      [order_id, req.merchant.id]
    );

    if (order.rowCount === 0) {
      return res
        .status(404)
        .json(errorResponse("NOT_FOUND_ERROR", "Order not found"));
    }

    const paymentId = generateId("pay_");
    let cardNet = null;
    let last4 = null;

    // ─── UPI VALIDATION ─────────────────────────────
    if (method === "upi") {
      if (!isValidVPA(vpa)) {
        return res
          .status(400)
          .json(errorResponse("INVALID_VPA", "Invalid VPA"));
      }
    }

    // ─── CARD VALIDATION ────────────────────────────
    if (method === "card") {
      const { number, exp_month, exp_year, cvv } = card || {};

      if (!number || !exp_month || !exp_year || !cvv || !luhnCheck(number)) {
        return res
          .status(400)
          .json(errorResponse("INVALID_CARD", "Invalid card details"));
      }

      if (isExpired(exp_month, exp_year)) {
        return res
          .status(400)
          .json(errorResponse("EXPIRED_CARD", "Card expired"));
      }

      cardNet = cardNetwork(number);
      last4 = number.slice(-4);
    }

    // ─── CREATE PAYMENT (processing) ────────────────
    await pool.query(
      `
      INSERT INTO payments
      (id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,'processing',$7,$8,$9,NOW(),NOW())
      `,
      [
        paymentId,
        order_id,
        req.merchant.id,
        order.rows[0].amount,
        order.rows[0].currency,
        method,
        vpa || null,
        cardNet,
        last4
      ]
    );

    // ─── ASYNC PAYMENT RESOLUTION ───────────────────
    setTimeout(async () => {
      try {
        const result = decideOutcome(method);

        await pool.query(
          `
          UPDATE payments
          SET status=$1,
              error_code=$2,
              updated_at=NOW()
          WHERE id=$3
          `,
          [result.status, result.reason || null, paymentId]
        );

        // ─── WEBHOOK (OPTIONAL) ─────────────────────
        if (process.env.WEBHOOK_URL) {
          await fetch(process.env.WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              payment_id: paymentId,
              status: result.status,
              reason: result.reason || null
            })
          });
        }

      } catch (err) {
        console.error("ASYNC PAYMENT ERROR:", err);
      }
    }, processingDelay());

    // ─── RESPONSE ───────────────────────────────────
    return res.status(201).json({
      id: paymentId,
      status: "processing"
    });

  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    return res
      .status(500)
      .json(errorResponse("PAYMENT_FAILED", "Payment processing failed"));
  }
});

/**
 * GET /api/v1/payments
 */
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM payments WHERE merchant_id=$1 ORDER BY created_at DESC",
    [req.merchant.id]
  );
  res.json(result.rows);
});

/**
 * GET /api/v1/payments/:payment_id
 */
router.get("/:payment_id", async (req, res) => {
  const { payment_id } = req.params;

  const result = await pool.query(
    "SELECT * FROM payments WHERE id=$1",
    [payment_id]
  );

  if (result.rowCount === 0) {
    return res
      .status(404)
      .json(errorResponse("NOT_FOUND_ERROR", "Payment not found"));
  }

  res.json(result.rows[0]);
});

module.exports = router;
