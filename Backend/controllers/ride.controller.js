const rideService = require('../services/ride.service')
const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service')
const {validationResult } = require("express-validator");

const {getAddressCoordinate , getCaptainsInTheRadius} =  require("../services/maps.service")

const {request} = require("express");
const {sendMessageToSocketId} = require("../socket")


module.exports.createRide = async (req , res , next)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const  {pickup , destination, vehicleType} = req.body;
        const userId = req.user._id;
        console.log("pickup is " + pickup);
        console.log("destination is " + destination);   
        console.log("vehicle type is " + vehicleType);
        console.log("user id is " + userId);
        const ride  = await rideService.createRide(
            userId,
            pickup,
            destination,
            vehicleType
        )
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const radius = 50000000 ;
        const captainsInRadius = await mapService.getCaptainsInTheRadius( 
            pickupCoordinates.ltd,
            pickupCoordinates.lng,
            radius
        )
        ride.otp = ""
        console.log("printing ride")
        console.log(ride)
        const rideWithUser = await rideModel.findOne({_id : ride._id}).populate("user")
         captainsInRadius.map(captain => {

            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })

        })
        console.log("ride with user");
     console.log(rideWithUser);
        console.log("captains in radius");
        console.log(captainsInRadius);
       
      res.status(201).json(ride)
    }
    catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getFare = async (req, res, next) => {
    try { 
        const errors  =  validationResult(req) 
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        const { pickup, destination } = req.query;
        const fare = await rideService.getFare(pickup, destination);
        console.log("fare is ")
        console.log(fare);
        res.status(200).json(fare);

    }
    catch (error) {
        console.error('Error getting fare:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.confirmRide = async (req, res, next) => { 
    try {
        const errors  =  validationResult(req)
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        const { rideId, otp , captainId } = req.body;
        const ride  =  await rideService.confirmRide({ rideId, captain: captainId });
        console.log("socket id " + ride.user.socketId);
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });
        res.status(200).json(ride);
    }
    catch (error) {
        console.error('Error confirming ride:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} ; 

module.exports.startRide = async (req, res, next) => { 
    try {
        const errors  =  validationResult(req)
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        const {rideId  , otp}  = req.query ; 
        const captain = req.captain;
        const ride  =  await rideService.startRide({rideId, otp , captain:req.captain}) 
         sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });
    res.status(200).json(ride);
    }
    catch (error) {
        console.error('Error starting ride:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    
    console.log(req.captain);
    console.log("printig the ecaptan in ");
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    console.error('Error ending ride:', err);
    return res.status(500).json({ message: err.message });
  }
  
};
