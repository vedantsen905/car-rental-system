import { Booking } from "../models/booking.model.js";
import { Car } from "../models/car.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";

// Book a car
 const bookCar = asyncHandler(async (req, res) => {
  const { carId, startDate, endDate } = req.body;

  if (!carId || !startDate || !endDate) {
    throw new ApiError(400, "All fields are required");
  }

  const car = await Car.findById(carId);
  if (!car || !car.available) {
    throw new ApiError(404, "Car not available");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    throw new ApiError(400, "End date must be after start date");
  }

  const totalPrice = Math.round(days * car.pricePerDay);

  const booking = await Booking.create({
    user: req.user._id,
    car: carId,
    startDate,
    endDate,
    totalPrice,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Car booked successfully"));
});

// Get current user's bookings
 const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("car");

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "User bookings fetched"));
});


export { bookCar, getMyBookings };