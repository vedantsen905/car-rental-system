import { Car } from "../models/car.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";

 
 const getAllCars = asyncHandler(async (req, res) => {
  const cars = await Car.find();
  return res
    .status(200)
    .json(new ApiResponse(200, cars, "All cars fetched successfully"));
});

 
 const addCar = asyncHandler(async (req, res) => {
  const { model, brand, pricePerDay, imageUrl } = req.body;

  if (!model || !brand || !pricePerDay || !imageUrl) {
    throw new ApiError(400, "All fields are required");
  }

  const car = await Car.create({ model, brand, pricePerDay, imageUrl });

  return res
    .status(201)
    .json(new ApiResponse(201, car, "Car added successfully"));
});

 
 const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  await car.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Car deleted successfully"));
});


export{
    getAllCars,
    addCar,
    deleteCar
}