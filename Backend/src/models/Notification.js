import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        required: true,
        enum: [
            'business_created',
            'business_updated',
            'business_bookmarked',
            'business_viewed',
            'profile_updated',
            'system'
        ]
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    relatedBusiness: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business'
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    link: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
