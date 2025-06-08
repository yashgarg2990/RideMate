const axios = require('axios');

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.GEO_API;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    

    const features = response.data.features;

    if (features && features.length > 0) {
      const coordinates = features[0].geometry.coordinates;
      return {
        lng: coordinates[0],
        lat: coordinates[1],
      };
    } else {
      throw new Error('No coordinates found for the provided address');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    throw error;
  }
};



module.exports.getDistanceTime = async (origin, destination) => {
  const apiKey = process.env.GEO_API;

  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  try {
    // URLs for geocoding origin and destination
    const url1 = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(origin)}&apiKey=${apiKey}`;
    const url2 = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(destination)}&apiKey=${apiKey}`;

    // Parallel requests
    const [originResponse, destinationResponse] = await Promise.all([
      axios.get(url1),
      axios.get(url2),
    ]);

    // Extract coordinates from geometry
    const originCoordsArray = originResponse.data?.features?.[0]?.geometry?.coordinates;
    const destinationCoordsArray = destinationResponse.data?.features?.[0]?.geometry?.coordinates;

    if (!originCoordsArray || !destinationCoordsArray) {
      throw new Error("Unable to fetch coordinates from Geoapify.");
    }

    const originCoordinates = {
      lat: originCoordsArray[1], // lat
      lng: originCoordsArray[0], // lng
    };
    console.log("Origin Coordinates:", originCoordinates);

    const destinationCoordinates = {
      lat: destinationCoordsArray[1],
      lng: destinationCoordsArray[0],
    };
    console.log("Destination Coordinates:", destinationCoordinates);


    // Haversine formula
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRadians(destinationCoordinates.lat - originCoordinates.lat);
    const dLng = toRadians(destinationCoordinates.lng - originCoordinates.lng);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(originCoordinates.lat)) *
        Math.cos(toRadians(destinationCoordinates.lat)) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // km
    const averageSpeedKmH = 50;
    const time = distance / averageSpeedKmH; // hours

    return {
      distance_meters: +(distance * 1000).toFixed(2), // in meters
      duration_minutes: +(time * 60).toFixed(2),      // in minutes
    };

  } catch (error) {
    console.error("Error calculating distance and time:", error.message || error);
    throw error;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
   const apiKey = process.env.GEO_API;
  if (!input) {
    throw new Error("Input text is required");
  }

  console.log("Input:", input);

  const url = `https://api.geoapify.com/v1/geocode/autocomplete`;

  try {
    const response = await axios.get(url, {
      params: {
        text: input,
        apiKey: apiKey,
        limit: 5, // Limit results for autocomplete suggestions
      },
    });

    const { features } = response.data;
    if (!features || features.length === 0) {
      throw new Error("No suggestions found for the given input.");
    }

    // console.log("Features:", features);

    // Extract suggestions
    const suggestions = features.map((feature) => ({
      label: feature.properties.formatted, // Use formatted address
      latitude: feature.properties.lat, // Latitude
      longitude: feature.properties.lon, // Longitude
    }));

    return suggestions;
  } catch (error) {
    console.error(
      "Error fetching autocomplete suggestions:",
      error.message || error
    );
    throw error;
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  // radius in km

  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371],
      },
    },
  });

  return captains;
};






