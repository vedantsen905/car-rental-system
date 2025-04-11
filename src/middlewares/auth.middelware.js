import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/api_error.js";

export const protect = asyncHandler(async (req, res, next) => {
  // 🟡 Check token from cookies first, then headers
  const token = req.cookies?.accessToken || (
    req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null
  );

  if (!token) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  // ✅ Decode and verify JWT
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // ✅ Use correct ID from token payload
  const user = await User.findById(decoded?.id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "Not authorized, user not found");
  }

  req.user = user;
  next();
});

// 🔒 Admin Only Middleware
export const admin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied - Admins only");
  }
  next();
});
