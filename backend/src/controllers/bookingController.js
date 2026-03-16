const Booking = require('../models/Booking');
const ServiceListing = require('../models/ServiceListing');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { serviceId, scheduledDate } = req.body;

        const service = await ServiceListing.findById(serviceId);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Prevent provider from booking their own service
        if (service.providerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot book your own service' });
        }

        const booking = new Booking({
            serviceId,
            clientId: req.user._id,
            providerId: service.providerId,
            scheduledDate
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user's outgoing bookings (as a client)
// @route   GET /api/bookings/client
// @access  Private
const getClientBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ clientId: req.user._id })
            .populate('serviceId', 'title price')
            .populate('providerId', 'name profilePicture')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get provider's incoming bookings
// @route   GET /api/bookings/provider
// @access  Private
const getProviderBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ providerId: req.user._id })
            .populate('serviceId', 'title price')
            .populate('clientId', 'name profilePicture')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check authorization (Provider can accept/reject/complete, Client can cancel)
        const isProvider = booking.providerId.toString() === req.user._id.toString();
        const isClient = booking.clientId.toString() === req.user._id.toString();

        if (!isProvider && !isClient) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Basic validation of status flow
        if (isClient && status !== 'cancelled') {
            return res.status(400).json({ message: 'Clients can only cancel bookings' });
        }

        booking.status = status;
        const updatedBooking = await booking.save();

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createBooking,
    getClientBookings,
    getProviderBookings,
    updateBookingStatus
};
