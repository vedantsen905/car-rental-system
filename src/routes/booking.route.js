import express from "express";
import { bookCar, getMyBookings } from "../controllers/booking.controller.js";
import { protect } from "../middlewares/auth.middelware.js";

const router = express.Router();

// POST /api/bookings — Book a car
router.post("/", protect, bookCar);

// GET /api/bookings/me — Get logged-in user's bookings
router.get("/me", protect, getMyBookings);

export default router
