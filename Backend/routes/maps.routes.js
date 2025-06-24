const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {query} = require('express-validator');


router.get('/get-coordinates',
    query('address').isString().isLength({min :3}) ,
    authMiddleware.authMiddleware ,
    mapController.getCoordinates
);

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authMiddleware,
    mapController.getDistanceTime
)

router.get(
  "/get-suggestions",
  query("input").isString().isLength({ min: 0 }),
   authMiddleware.authMiddleware,
  mapController.getAutoCompleteSuggestions
);

module.exports = router;