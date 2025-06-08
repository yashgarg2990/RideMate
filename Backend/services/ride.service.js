const rideModel =  require("../models/ride.model")
const {getDistanceTime} = require("./maps.service")
const crypto = require("crypto")

module.exports.createRide = async (
    userId , 
    pickup , 
    destination , 
    vehicleType,
    
) => {
      console.log(userId, pickup, destination, vehicleType);

  // Validate required fields
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error("Please provide all required fields");
  }

  const fare = await module.exports.getFare(pickup , destination)
  console.log("Fare:", fare);

  if(!fare[vehicleType]) {
    throw new Error("Invalid vehicle type or fare not available");
  }
  const ride  =  new rideModel.create({ 
    user : userId , 
    pickup , 
    destination ,
    fare : fare[vehicleType],
    otp: getOtp(6),
  })
    return ride;
}

function getOtp(num) {
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num) - 1);
    return otp.toString();
}

module.exports.getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Please provide pickup and destination");
  }

  // Get distance and duration from the map service
  const { distance, duration } = await getDistanceTime(pickup, destination);
  // Fare structure for different vehicle types
  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5,
  };

  // Calculate the fare for each vehicle type
  const fare = {
    auto: Math.round(
      baseFare.auto +
        (distance / 1000) * perKmRate.auto +
        (duration / 60) * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        (distance / 1000) * perKmRate.car +
        (duration / 60) * perMinuteRate.car
    ),
    moto: Math.round(
      baseFare.moto +
        (distance / 1000) * perKmRate.moto +
        (duration / 60) * perMinuteRate.moto
    ),
  };

  // console.log("Fare:", fare);

  return fare;
};


module.exports.confirmRide = async(rideId , captain) =>{
    if (!rideId || !captain) {
        throw new Error("Please provide ride ID and captain details");
    }
    const ride = await rideModel.findOneAndUpdate(
        {_id : rideId } ,
        {status :"accepted" , captain : captain } ,
        {new : true }

    )
    .populate("user")
    .populate("captain")
    .select("+otp")

    if (!ride) {
        throw new Error("Ride not found or already confirmed");
    }
    return ride;

}

module.exports.StartRide = async (rideId , otp , captain) => {
    if (!rideId || !otp || !captain) { 
        throw new Error("Please provide ride ID, OTP, and captain details");
    }
    const ride  =  await rideModel.findOne({_id :  rideId })
    .populate("captain")
    .populate("user")
    .select("+otp");
    if (!ride) {
        throw new Error("Ride not found");
    }
    if (ride.status !== "accepted") {
        throw new Error("Ride is not accepted or already started");
    }
    if (ride.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    await rideModel.findOneAndUpdate( 
        {_id: rideId},
        {status :"ongoing" ,}
    )

    return ride  ; 
}

module.exports.EndRide = async ({rideId  , captain}) => {
    if (!rideId ) {
        throw new Error("Please provide ride ID and OTP");
    }
    const ride = await rideModel.findOne({_id: rideId , captain : captain._id})
        .populate("captain")
        .populate("user")
        .select("+otp");

    if (!ride) {
        throw new Error("Ride not found");
    }
    if (ride.status !== "ongoing") {
        throw new Error("Ride is not ongoing or already ended");
    }
    if (ride.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    await rideModel.findOneAndUpdate(
        {_id: rideId},
        {status: "completed"}
    );

    return ride;
};