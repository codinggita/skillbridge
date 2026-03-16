const mongoose = require('mongoose');

const ServiceListingSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Create text index for search
ServiceListingSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('ServiceListing', ServiceListingSchema);
