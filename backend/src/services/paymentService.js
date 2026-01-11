function decideOutcome(method) {
  const r = Math.random();

  if (method === "card") {
    if (r < 0.2) return { status: "failed", reason: "INSUFFICIENT_FUNDS" };
    if (r < 0.3) return { status: "failed", reason: "BANK_DECLINED" };
  }

  if (method === "upi") {
    if (r < 0.15) return { status: "failed", reason: "UPI_DECLINED" };
  }

  return { status: "success" };
}

function processingDelay() {
  return Number(process.env.TEST_PROCESSING_DELAY || 1000);
}

module.exports = { decideOutcome, processingDelay };
