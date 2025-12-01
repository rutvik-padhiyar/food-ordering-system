const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
    addAddress,
    listAddress,
    deleteAddress,
    updateAddress,
} = require("../controllers/addressController");

const router = express.Router();

// ADD NEW ADDRESS
router.post("/add", auth, addAddress);

// GET ADDRESS LIST BY USER ID PARAM
router.get("/list/:userId", auth, listAddress);

// GET ADDRESS LIST FROM TOKEN
router.get("/list", auth, listAddress);

// DELETE ADDRESS
router.delete("/delete/:id", auth, deleteAddress);

// UPDATE ADDRESS
router.put("/update/:id", auth, updateAddress);

module.exports = router;