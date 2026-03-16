const express = require('express');
const router = express.Router();
const {
    createBooking,
    getClientBookings,
    getProviderBookings,
    updateBookingStatus
} = require('../controllers/bookingController');
const protect = require('../middlewares/auth');

router.route('/')
    .post(protect, createBooking);

router.route('/client')
    .get(protect, getClientBookings);

router.route('/provider')
    .get(protect, getProviderBookings);

router.route('/:id/status')
    .put(protect, updateBookingStatus);

module.exports = router;
