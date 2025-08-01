const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🛡 Authenticate JWT and attach user to request
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    req.user = null;
    return next(); // allow public routes like logout to continue
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      req.user = null;
      return next(); // let controller handle it
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      console.warn(
        "Token expired for user:",
        req.user ? req.user._id : "unknown"
      );
    } else {
      console.error("Invalid token or user not found");
    }

    req.user = null;
    return next(); // let logout route or controller handle it
  }
};

// ✅ Role-based access control (RBAC)
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      return next();
    }

    console.warn(
      `Access denied for user ${req.user?.email || "unknown"} with role ${
        req.user?.role
      }`
    );

    return res
      .status(403)
      .json({ message: "Access denied: Unauthorized role" });
  };
};

// ✅ Shortcut for admin-only routes
const adminOnly = roleCheck("admin");

module.exports = {
  protect,
  adminOnly,
  roleCheck,
};
