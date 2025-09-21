const express = require('express');
const router = express.Router();
const { createPayment, handleWebhook, checkPaymentStatus } = require('../controllers/paymentController'); // Import checkPaymentStatus
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment', protect, createPayment);
router.post('/webhook', handleWebhook);

// New route to check transaction status
router.get('/status/:collectId', protect, checkPaymentStatus);

module.exports = router;