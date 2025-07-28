// middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserManagement = require("../models/UserManagement");

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

const adminOnly = async (req, res, next) => {
  const userManagement = await UserManagement.findOne({
    userId: req?.user?._id,
  });
  if (
    req.user &&
    (req.user.role === "admin" ||
      req.user.role === "super-admin" ||
      userManagement.roles.length > 0)
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied: Admins or Super Admins only" });
};

module.exports = {
  protect,
  adminOnly,
};
