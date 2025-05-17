// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Send response based on environment
  const response = {
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };
  
  res.status(statusCode).json(response);
};