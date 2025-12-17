import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { sendPasswordResetEmail } from "../utils/emailService.js";
import { createNotification } from "./notificationController.js";

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d'
    });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { name, email, password, userType } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "User with this email already exists" 
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 8 characters long" 
            });
        }

        // Check for uppercase letter
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ 
                success: false,
                message: "Password must contain at least one uppercase letter" 
            });
        }

        // Check for special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({ 
                success: false,
                message: "Password must contain at least one special character" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userType: userType || 'user'
        });

        await newUser.save();

        // Generate token
        const token = generateToken(newUser._id);

        // Send welcome notification
        await createNotification({
            recipient: newUser._id,
            type: 'system',
            title: 'Welcome to BizConnect!',
            message: `Hi ${newUser.name}, welcome to BizConnect! Start exploring businesses or create your own business profile.`,
            link: newUser.userType === 'business' ? '/business/dashboard' : '/user/dashboard'
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                userType: newUser.userType
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error during registration",
            error: error.message 
        });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error during login",
            error: error.message 
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error",
            error: error.message 
        });
    }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "No account found with this email" 
            });
        }

        // Generate reset token (valid for 24 hours)
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '24h'
        });

        // Save reset token and expiry (24 hours)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 86400000; // 24 hours
        await user.save();

        // Send password reset email
        try {
            await sendPasswordResetEmail(user.email, resetToken);
            console.log('Password reset email sent successfully to:', user.email);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails - token is still saved
            return res.status(200).json({
                success: true,
                message: "Password reset token generated. Email service temporarily unavailable.",
                // Remove this in production
                resetToken
            });
        }

        res.status(200).json({
            success: true,
            message: "Password reset link has been sent to your email"
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error",
            error: error.message 
        });
    }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Verify token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key');
        
        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid or expired reset token" 
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error",
            error: error.message 
        });
    }
};
