// server/routes/restaurantRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
    addRestaurant,
    getAllRestaurants,
    getRestaurantById,
    getNearbyRestaurants,
} = require("../controllers/restaurantController");

// ✅ multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
        cb(
            null,
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname)
        ),
});
const upload = multer({ storage });

// ✅ routes
router.post(
    "/add",
    upload.fields([
        { name: "panCardImage", maxCount: 1 },
        { name: "restaurantImage", maxCount: 1 },
    ]),
    addRestaurant
);

router.get("/all", getAllRestaurants);

// ⚠️ NEARBY must be before :id
// Example: GET /api/restaurant/nearby?lat=19.0760&lng=72.8777&distance=5
router.get("/nearby", getNearbyRestaurants);

// get by id
router.get("/:id", getRestaurantById);

module.exports = router;