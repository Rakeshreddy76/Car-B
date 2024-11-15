const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createCar,
    getCars,
    getCarById,
    updateCar,
    deleteCar,
} = require('../controllers/carController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    },
});

// Routes
router.route('/')
    .get(protect, getCars)
    .post(protect, upload.array('images', 10), createCar);

router.route('/:id')
    .get(protect, getCarById)
    .put(protect, upload.array('images', 10), updateCar)
    .delete(protect, deleteCar);

module.exports = router;
