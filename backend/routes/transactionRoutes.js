const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getTransactionsBySchool,
} = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');

// This line applies the 'protect' middleware to all routes defined in this file.
// It ensures that a user must be logged in to access any of these endpoints.
router.use(protect);

// Route to get all transactions
// This supports pagination, sorting, and filtering via query parameters.
// Example: GET /api/transactions?page=1&status=Success
router.get('/', getAllTransactions);

// Route to get all transactions for a specific school
// Example: GET /api/transactions/school/65b0e6293e9f76a9694d84b4
router.get('/school/:schoolId', getTransactionsBySchool);

module.exports = router;