const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  // 1. Check if the header exists
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // 2. Check format "Bearer <token>"
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  // 3. Verify Token
  try {
    // Uses the secret from .env or falls back to 'secret_key' for development
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token verification failed" });
  }
}

module.exports = requireAuth;