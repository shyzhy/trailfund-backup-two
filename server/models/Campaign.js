const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    name: { type: String, required: true }, // Mapped from title
    description: { type: String, required: true },
    target_amount: { type: Number, required: true },
    min_donation: Number,
    max_donation: Number,
    donation_type: { type: String, enum: ['Cash', 'Digital', 'Items'], default: 'Cash' },
    designated_site: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    admin_feedback: String,
    date_created: { type: Date, default: Date.now },
    date_approved: Date,
    image: String // Kept for UI compatibility
});

module.exports = mongoose.model('Campaign', CampaignSchema);
