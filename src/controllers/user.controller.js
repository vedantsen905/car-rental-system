import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";

// 🔐 Generate Tokens
const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generating tokens:", error.message);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// 🧾 Register Controller
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) throw new ApiError(400, "Name is required");
  if (!email || !email.includes("@gmail.com")) throw new ApiError(400, "Valid Gmail is required");
  if (!password) throw new ApiError(400, "Password is required");

  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(409, "User with this email already exists");

  const user = await User.create({ name, email, password });

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id);

  // 🍪 Set tokens in cookies
  res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000 // 15 minutes
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    .json(new ApiResponse(201, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }, "Successfully registered"));
});

// 🔓 Login Controller
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@gmail.com")) throw new ApiError(400, "Valid Gmail is required");
  if (!password) throw new ApiError(400, "Password is required");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id);

  // 🍪 Set tokens in cookies
  res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000 // 15 minutes
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    .json(new ApiResponse(200, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }, "Successfully logged in"));
});

export { registerUser, loginUser };
