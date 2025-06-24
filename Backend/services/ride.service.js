const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model')
const mapService = require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };



    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;


}

module.exports.getFare = getFare;


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async (
    user, pickup, destination, vehicleType
) => {
  console.log(" in services ")
  console.log(user);
  console.log(pickup);
  console.log(destination);
  console.log(vehicleType);
    if (!user || !pickup || !destination || !vehicleType) {
      // all so telll which field is missing
      return {
        error: 'All fields are required',
        fields: {
          user: !!user,
          pickup: !!pickup,
          destination: !!destination,
          vehicleType: !!vehicleType
        }
      };

      
    }

    const fare = await getFare(pickup, destination);



    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[ vehicleType ]
    })

    if (!ride) {
        throw new Error('Ride creation failed');
    }
    console.log("servies function end here and controller will get the ride object")

    return ride;
}

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    const exists = await captainModel.findById(captain);
console.log("Captain exists?", exists); // should print actual doc

    console.log("in connfirm Ride serviec ")
    console.log(rideId)
    console.log(captain)
    const findRide =  await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        
    })

     const capincluded =  await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        
        captain: captain
    })

    if(!findRide) {
        console.log("Ride Not found ")
        return ;
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');
    console.log("ride object in confirm ride service")
    console.log(ride)

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    console.log("in End Ride service ")
    console.log(rideId)
    console.log(captain)
    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}
