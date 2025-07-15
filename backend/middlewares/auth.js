// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    req.user = null; // allow public routes like logout to continue
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      req.user = null; // user deleted
      return next(); // let controller handle it
    }

    req.user = user;
    next();
  } catch (error) {
    req.user = null; // token invalid or expired
    return next(); // allow logout to continue
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Admins only" });
};

module.exports = {
  protect,
  adminOnly,
};
