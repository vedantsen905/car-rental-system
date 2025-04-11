import express from "express";
import { getAllCars, addCar, deleteCar } from "../controllers/car.controller.js";
import { protect, admin } from "../middlewares/auth.middelware.js";

const router = express.Router();

router.get("/", protect, getAllCars);
router.post("/", protect, admin, addCar);
router.delete("/:id", protect, admin, deleteCar);

export default router
