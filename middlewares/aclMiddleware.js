const hasRole = (...roles) => {
  return (req, res, next) => {
    if (req.session && roles.includes(req.session.user?.role)) {
      return next();
    }
    res.status(403).send('Forbidden: Anda tidak memiliki akses');
  };
};

module.exports = { hasRole };