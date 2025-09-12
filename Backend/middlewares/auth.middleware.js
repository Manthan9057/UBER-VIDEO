const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  try {
    // Get token from cookie or header
    const authHeader = req.headers.authorization;
    const token =
      req.cookies.token ||
      (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    const isBlacklisted = await userModel.findOne({ token: token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token has been revoked." });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use the correct field from payload (_id not id)
    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
 
