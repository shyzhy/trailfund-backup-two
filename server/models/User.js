const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
    name: { type: String, required: true }, // Mapped from fullName
    age: Number,
    college: String,
    department: String,
    year_level: String, // Mapped from yearLevel
    bio: String,
    profile_picture: String, // Mapped from avatar
    ustep_linked: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'restricted', 'banned'], default: 'active' },
    date_created: { type: Date, default: Date.now } // Mapped from createdAt
});

module.exports = mongoose.model('User', UserSchema);
