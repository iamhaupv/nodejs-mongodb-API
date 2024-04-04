const jwt = require("jsonwebtoken");

module.exports = function checkToken(req, res, next) {
  if (
    req.url.toLowerCase().trim() == "/users/login".toLowerCase().trim() ||
    req.url.toLowerCase().trim() == "/users/register".toLowerCase().trim() || 
    req.url.toLowerCase().trim() == "/users/sendResetLinkEmail".toLowerCase().trim() ||
    req.url.toLowerCase().trim() == "/users/reset/".toLowerCase().trim()
  ) {
    next();
    return;
  }
  const token = req.headers?.authorization?.split(" ")[1];
  try {
    const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
    const isExpired = Date.now() >= jwtObject.exp * 1000;
    if (isExpired) {
      res.status(500).json({
        message: "Token is expired",
      });
      res.end();
    } else {
      next();
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
