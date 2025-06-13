import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const jwtAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request - No token provided",
      });
    }


    const decodedToken = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    const user = await User.findById(decodedToken?.id).select("-password"); // ✅ 


    if (!user) {
      return res.status(401).json({
        message: "Unauthorized request - User not found",
      });
    }

    // 4. Attach user to request and continue
    req.user = user;
    next();
  } catch (error) {
    console.log("JWT Auth Error:", error.message);
    return res.status(401).json({
      message: "Unauthorized request - Invalid or expired token",
    });
  }
};

export { jwtAuth };