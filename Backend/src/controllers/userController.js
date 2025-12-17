import User from "../models/User.js";
import Business from "../models/Business.js";
import bcrypt from "bcryptjs";
import { createNotification } from "./notificationController.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

          // 🔐 hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = new User({ name, email, password : hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        // Find all users
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Update user by ID
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send profile update confirmation notification
        await createNotification({
            recipient: updatedUser._id,
            type: 'profile_updated',
            title: 'Profile Updated',
            message: 'Your profile has been successfully updated.',
            link: updatedUser.userType === 'business' ? '/business/dashboard' : '/user/dashboard'
        });

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};  

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete user by ID
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// @desc    Add business to bookmarks
// @route   POST /api/v1/user/bookmarks/:businessId
// @access  Private
export const addBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const { businessId } = req.params;

        // Check if business exists
        const business = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        // Get user and check if already bookmarked
        const user = await User.findById(userId);
        if (user.bookmarks.includes(businessId)) {
            return res.status(400).json({
                success: false,
                message: "Business already bookmarked"
            });
        }

        // Add to bookmarks
        user.bookmarks.push(businessId);
        await user.save();

        // Create notification for business owner
        await createNotification({
            recipient: business.owner,
            sender: userId,
            type: 'business_bookmarked',
            title: 'New Bookmark',
            message: `${user.name} bookmarked your business "${business.businessName}"`,
            relatedBusiness: businessId,
            link: `/business/detail/${businessId}`
        });

        // Create confirmation notification for the user who bookmarked
        await createNotification({
            recipient: userId,
            type: 'system',
            title: 'Bookmark Added',
            message: `You bookmarked "${business.businessName}". View your bookmarks anytime from your dashboard.`,
            relatedBusiness: businessId,
            link: `/user/bookmarks`
        });

        res.status(200).json({
            success: true,
            message: "Business bookmarked successfully",
            bookmarks: user.bookmarks
        });
    } catch (error) {
        console.error("Add bookmark error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Remove business from bookmarks
// @route   DELETE /api/v1/user/bookmarks/:businessId
// @access  Private
export const removeBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const { businessId } = req.params;

        const user = await User.findById(userId);
        
        // Remove from bookmarks
        user.bookmarks = user.bookmarks.filter(
            bookmark => bookmark.toString() !== businessId
        );
        await user.save();

        res.status(200).json({
            success: true,
            message: "Bookmark removed successfully",
            bookmarks: user.bookmarks
        });
    } catch (error) {
        console.error("Remove bookmark error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Get user's bookmarked businesses
// @route   GET /api/v1/user/bookmarks
// @access  Private
export const getBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate({
            path: 'bookmarks',
            populate: {
                path: 'owner',
                select: 'name email'
            }
        });

        res.status(200).json({
            success: true,
            bookmarks: user.bookmarks
        });
    } catch (error) {
        console.error("Get bookmarks error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Check if business is bookmarked
// @route   GET /api/v1/user/bookmarks/check/:businessId
// @access  Private
export const checkBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const { businessId } = req.params;

        const user = await User.findById(userId);
        const isBookmarked = user.bookmarks.includes(businessId);

        res.status(200).json({
            success: true,
            isBookmarked
        });
    } catch (error) {
        console.error("Check bookmark error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Get user profile
// @route   GET /api/v1/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
