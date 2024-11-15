const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    description: {
        type: String,
    },
    tags: {
        car_type: { type: String },
        company: { type: String },
        dealer: { type: String },
    },
    images: [{
        type: String, 
    }],
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);
