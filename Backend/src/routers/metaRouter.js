import express from 'express';
import { 
    getCategories, 
    getCountries, 
    getStatesByCountry,
    seedCategories,
    seedCountries
} from '../controllers/metaController.js';

const router = express.Router();

// Public routes
router.get('/categories', getCategories);
router.get('/countries', getCountries);
router.get('/countries/:countryCode/states', getStatesByCountry);

// Seed routes (for initial setup - can be protected later)
router.post('/seed/categories', seedCategories);
router.post('/seed/countries', seedCountries);

export default router;
