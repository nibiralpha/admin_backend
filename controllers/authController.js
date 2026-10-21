const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// Helper to generate a brief, in-memory Access Token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

// Helper to generate a long-lived Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // 1. Basic validation
    if (!userName || !password) {
      return res.status(400).json({ message: 'Please provide both userName and password' });
    }

    // 2. Locate user and explicitly request the select: false password field
    const user = await User.findOne({ userName }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Vague on purpose for security
    }

    // 3. Verify password hash matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Generate token metrics
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 5. Send Refresh Token inside a secure HTTP-Only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Shields token from Cross-Site Scripting (XSS)
      secure: process.env.NODE_ENV === 'production', // Uses HTTPS in prod
      sameSite: 'strict', // Shields from CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Matches token life (7 days)
    });

    // 6. Return standard user info and memory access token
    return res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        userName: user.userName,
      },
      accessToken, // Store in application state/memory client-side
    });

  } catch (error) {
    console.error('Login Endpoint Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { loginUser };