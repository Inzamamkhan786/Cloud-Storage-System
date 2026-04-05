const express = require("express");
const router = express.Router();

const billingController = require("../Controllers/billingController");
const authMiddleware = require("../Middleware/authMiddleware");


// STORAGE + FILE COUNT
router.get("/usage", authMiddleware, billingController.getUsage);

// API usage summary
router.get("/summary", authMiddleware, billingController.getUsageSummary);

// Billing invoice
router.get("/invoice", authMiddleware, billingController.getBillingDetails);


// Get usage in number
router.get("/usage-num",authMiddleware,billingController.getUseNum);

module.exports = router;
