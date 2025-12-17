import Business from "../models/Business.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

// @desc    Create business profile
// @route   POST /api/v1/business
// @access  Private (Business owners only)
export const createBusiness = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        // Check if user is a business owner
        const user = await User.findById(req.user.id);
        if (user.userType !== 'business') {
            return res.status(403).json({
                success: false,
                message: "Only business owners can create business profiles"
            });
        }

        // Allow multiple businesses per owner
        const businessData = {
            ...req.body,
            owner: req.user.id
        };

        const business = new Business(businessData);
        await business.save();

        res.status(201).json({
            success: true,
            message: "Business profile created successfully",
            business
        });
    } catch (error) {
        console.error("Create business error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Get all businesses owned by the authenticated user
// @route   GET /api/v1/business/my-business
// @access  Private (Business owners only)
export const getMyBusiness = async (req, res) => {
    try {
        const businesses = await Business.find({ owner: req.user.id })
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: businesses.length,
            businesses
        });
    } catch (error) {
        console.error("Get my businesses error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Update business profile
// @route   PUT /api/v1/business/:id
// @access  Private (Business owners only)
export const updateBusiness = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        // Check if user owns the business
        if (business.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this business"
            });
        }

        const updatedBusiness = await Business.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Business updated successfully",
            business: updatedBusiness
        });
    } catch (error) {
        console.error("Update business error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Delete business profile
// @route   DELETE /api/v1/business/:id
// @access  Private (Business owners only)
export const deleteBusiness = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        // Check if user owns the business
        if (business.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this business"
            });
        }

        await business.deleteOne();

        res.status(200).json({
            success: true,
            message: "Business deleted successfully"
        });
    } catch (error) {
        console.error("Delete business error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Get all businesses (with search and filters)
// @route   GET /api/v1/business
// @access  Public
export const getAllBusinesses = async (req, res) => {
    try {
        const { search, category, city, page = 1, limit = 10 } = req.query;

        const query = { isActive: true };

        // Search by business name or description
        if (search) {
            query.$text = { $search: search };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by city
        if (city) {
            query['address.city'] = new RegExp(city, 'i');
        }

        const businesses = await Business.find(query)
            .populate('owner', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Business.countDocuments(query);

        res.status(200).json({
            success: true,
            businesses,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error("Get businesses error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Get single business by ID
// @route   GET /api/v1/business/:id
// @access  Public
export const getBusinessById = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id).populate('owner', 'name email');

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        // Increment view count
        business.views += 1;
        await business.save();

        res.status(200).json({
            success: true,
            business
        });
    } catch (error) {
        console.error("Get business error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Search businesses with filters
// @route   GET /api/v1/business/search
// @access  Public
export const searchBusinesses = async (req, res) => {
    try {
        const { 
            keyword, 
            category, 
            city, 
            state, 
            services,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        // Build search query
        const query = { isActive: true };

        // Text search in business name and description
        if (keyword) {
            query.$or = [
                { businessName: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        // Filter by location
        if (city) {
            query['address.city'] = { $regex: city, $options: 'i' };
        }

        if (state) {
            query['address.state'] = { $regex: state, $options: 'i' };
        }

        // Filter by services
        if (services) {
            query['services.name'] = { $regex: services, $options: 'i' };
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        const businesses = await Business.find(query)
            .populate('owner', 'name email')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort(sortOptions);

        const count = await Business.countDocuments(query);

        res.status(200).json({
            success: true,
            businesses,
            totalPages: Math.ceil(count / parseInt(limit)),
            currentPage: parseInt(page),
            total: count
        });
    } catch (error) {
        console.error("Search businesses error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
