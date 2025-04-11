import express from "express";

import userRoute from "./routes/user.route.js";
import carRoute from "./routes/car.route.js";
import bookingRoute from "./routes/booking.route.js";
import cookieParser from "cookie-parser";




const app = express(); 
app.use(cookieParser()); 

app.use(express.json());


app.use("/api/v1/users", userRoute);
app.use("/api/v1/cars", carRoute);
app.use("/api/v1/bookings", bookingRoute);

export { app };
