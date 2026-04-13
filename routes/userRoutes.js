const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.get('/', protect, admin, getUsers);
router.get('/test', (req, res) => res.send('API users route test works'));
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;