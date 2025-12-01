const multer = require("multer");
const path = require("path");

// Storage setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

// Filter allowed image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
    }
};

// Multer instance to accept two fields
const upload = multer({
    storage,
    fileFilter,
}).fields([
    { name: "panCardImage", maxCount: 1 },
    { name: "restaurantImage", maxCount: 1 },
]);

module.exports = upload;