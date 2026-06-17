// Tiny request logger so every request's method + path is visible in the
// server output. Runs early in the middleware chain.
function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

module.exports = logger;
