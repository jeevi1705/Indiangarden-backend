const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderToShipped,
  deleteOrder,
  adminUpdatePaymentStatus,
  createRazorpayOrder,
  verifyPayment,
} = require('../controllers/orderController');
const {
  registerUser,
  getUserProfile,
  getUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/ship').put(protect, admin, updateOrderToShipped);
router.route('/:id/payment').put(protect, admin, adminUpdatePaymentStatus);
router.route('/razorpay').post(protect, createRazorpayOrder);
router.route('/verify').post(protect, verifyPayment);
router.get('/config/razorpay', (req, res) => res.send(process.env.RAZORPAY_KEY_ID));

module.exports = router;