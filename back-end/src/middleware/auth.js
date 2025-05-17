import jwt from 'jsonwebtoken';

// Middleware to check if user is authenticated for web routes
export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access this resource');
  res.redirect('/auth/login');
};

// Middleware to check if user is not authenticated for web routes
export const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  res.redirect('/dashboard');
};

// Middleware to check if user is authenticated for API routes
export const isApiAuthenticated = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// Middleware to restrict access to admin users
export const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  req.flash('error_msg', 'Access denied. Admin privileges required.');
  res.redirect('/dashboard');
};

// Handle API errors
export const apiErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Check if headers have already been sent
  if (res.headersSent) {
    return next(err);
  }
  
  // Send error response
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};