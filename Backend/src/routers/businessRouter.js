import express from 'express';
import { body } from 'express-validator';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
    createBusiness,
    getMyBusiness,
    updateBusiness,
    deleteBusiness,
    getAllBusinesses,
    getBusinessById,
    searchBusinesses
} from '../controllers/businessController.js';

const router = express.Router();

// Protected routes (require authentication) - MUST come before parameterized routes
router.get('/my-business', protect, getMyBusiness);

router.post('/', 
    protect,
    [
        body('businessName').notEmpty().withMessage('Business name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('contactEmail').isEmail().withMessage('Valid email is required'),
        body('contactPhone').notEmpty().withMessage('Contact phone is required'),
        body('address.street').notEmpty().withMessage('Street address is required'),
        body('address.city').notEmpty().withMessage('City is required'),
        body('address.state').notEmpty().withMessage('State is required'),
        body('address.zipCode').notEmpty().withMessage('Zip code is required')
    ],
    createBusiness
);

router.put('/:id', protect, updateBusiness);
router.delete('/:id', protect, deleteBusiness);

// Public routes - MUST come after specific routes
router.get('/search/filter', searchBusinesses);
router.get('/', getAllBusinesses);
router.get('/:id', optionalAuth, getBusinessById);

export default router;
