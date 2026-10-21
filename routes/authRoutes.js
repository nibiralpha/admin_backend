const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// POST http://localhost:3000/api/v1/auth/login
router.post('/login', loginUser);

module.exports = router;