const ServiceListing = require('../models/ServiceListing');

// @desc    Get all service listings with pagination & search
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const keyword = req.query.keyword
            ? {
                $text: { $search: req.query.keyword }
            }
            : {};
            
        // Filter by category if provided
        if (req.query.category) {
            keyword.category = req.query.category;
        }

        const count = await ServiceListing.countDocuments({ ...keyword });
        
        let query = ServiceListing.find({ ...keyword }).populate('providerId', 'name profilePicture rating');
        
        // Sorting logic
        if (req.query.sort === 'price_asc') {
            query = query.sort({ price: 1 });
        } else if (req.query.sort === 'price_desc') {
            query = query.sort({ price: -1 });
        } else if (req.query.sort === 'rating') {
            query = query.sort({ rating: -1 });
        } else {
            query = query.sort({ createdAt: -1 });
        }

        const services = await query.limit(limit).skip(skip);

        res.json({
            services,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single service listing
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await ServiceListing.findById(req.params.id)
            .populate('providerId', 'name profilePicture bio skills role');

        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a service listing
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
    try {
        const { title, description, category, price, images } = req.body;

        const service = new ServiceListing({
            providerId: req.user._id,
            title,
            description,
            category,
            price,
            images: images || [],
        });

        const createdService = await service.save();
        res.status(201).json(createdService);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
    try {
        const { title, description, category, price, images } = req.body;

        const service = await ServiceListing.findById(req.params.id);

        if (service) {
            // Check if user is the provider
            if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'User not authorized' });
            }

            service.title = title || service.title;
            service.description = description || service.description;
            service.category = category || service.category;
            service.price = price || service.price;
            service.images = images || service.images;

            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
    try {
        const service = await ServiceListing.findById(req.params.id);

        if (service) {
            if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'User not authorized' });
            }

            await ServiceListing.deleteOne({ _id: service._id });
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
