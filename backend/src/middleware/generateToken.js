const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not defined in the environment variables');
  }

  return jwt.sign(
    { userId }, // Payload: Storing the user ID in the token
    secret, // Secret key
    { expiresIn: '1h' } // Token expiration (1 hour)
  );
};

module.exports = generateToken;
