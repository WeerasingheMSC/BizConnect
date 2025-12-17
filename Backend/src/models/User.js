import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['user', 'business'],
        default: 'user',
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business'
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;