const express = require("express")
const router = express.Router();

const  {body , query} = require("express-validator")
const  {createRide , getFare , confirmRide , startRide , endRide} =  require("../controllers/ride.controller")

const authMiddleware = require("../middleware/auth.middleware")

router.post("/create" , 
    body("pickup").isString().isLength({min:3}).withMessage("Invalid pickup location"),
    body("destination").isString().isLength({min:3}).withMessage("Invalid destination location"),
    body("vehicleType").isString().isIn(["moto", "auto", "car"]).withMessage("Invalid vehicle type"),
    authMiddleware.authMiddleware,
    createRide
)

router.get(
  "/get-fare",
  query("pickup").isString().isLength({ min: 3 }).withMessage("Invalid Pickup"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid Drop"),
  authMiddleware.authMiddleware,
  getFare
);

router.post(
  "/confirm",
  body("rideId").isMongoId().withMessage("Invalid Ride Id"),
  // authMiddleware.authCaptain,
  confirmRide
);

router.get(
  "/start-ride",
  query("rideId").isMongoId().withMessage("Invalid Ride Id"),
  query("otp").isString().isLength({ min: 6 }).withMessage("Invalid OTP"),
  // authMiddleware.authCaptain,
  startRide
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  endRide
);

module.exports = router;