const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  // Check if not token
  if (!token) {
    res.status(401).json({
      msg: 'No Token'
    });
    next();
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    //console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      msg: 'Token Invalid'
    });
  }
};
