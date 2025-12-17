import Category from '../models/Category.js';
import Country from '../models/Country.js';

// Get all active categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .select('name description')
            .sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
};

// Get all active countries with states
export const getCountries = async (req, res) => {
    try {
        const countries = await Country.find({ isActive: true })
            .select('name code states')
            .sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            countries
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching countries'
        });
    }
};

// Get states for a specific country
export const getStatesByCountry = async (req, res) => {
    try {
        const { countryCode } = req.params;
        
        const country = await Country.findOne({ 
            code: countryCode.toUpperCase(), 
            isActive: true 
        }).select('states');
        
        if (!country) {
            return res.status(404).json({
                success: false,
                message: 'Country not found'
            });
        }
        
        res.status(200).json({
            success: true,
            states: country.states
        });
    } catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching states'
        });
    }
};

// Seed initial categories (for development/setup)
export const seedCategories = async (req, res) => {
    try {
        const defaultCategories = [
            { name: 'Restaurant', description: 'Food and dining services' },
            { name: 'Retail', description: 'Retail stores and shops' },
            { name: 'Services', description: 'General services' },
            { name: 'Healthcare', description: 'Medical and health services' },
            { name: 'Education', description: 'Educational institutions' },
            { name: 'Technology', description: 'IT and tech services' },
            { name: 'Construction', description: 'Construction and building' },
            { name: 'Entertainment', description: 'Entertainment and events' },
            { name: 'Consulting', description: 'Consulting services' },
            { name: 'Fitness', description: 'Fitness and wellness' },
            { name: 'Beauty & Spa', description: 'Beauty and spa services' },
            { name: 'Legal Services', description: 'Legal and law services' },
            { name: 'Other', description: 'Other business types' }
        ];

        await Category.insertMany(defaultCategories, { ordered: false });
        
        res.status(200).json({
            success: true,
            message: 'Categories seeded successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({
                success: true,
                message: 'Categories already exist'
            });
        }
        console.error('Error seeding categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error seeding categories'
        });
    }
};

// Seed initial countries (for development/setup)
export const seedCountries = async (req, res) => {
    try {
        const defaultCountries = [
            {
                name: 'Sri Lanka',
                code: 'LK',
                states: [
                    { name: 'Western Province', code: 'WP' },
                    { name: 'Central Province', code: 'CP' },
                    { name: 'Southern Province', code: 'SP' },
                    { name: 'Northern Province', code: 'NP' },
                    { name: 'Eastern Province', code: 'EP' },
                    { name: 'North Western Province', code: 'NWP' },
                    { name: 'North Central Province', code: 'NCP' },
                    { name: 'Uva Province', code: 'UP' },
                    { name: 'Sabaragamuwa Province', code: 'SG' }
                ]
            },
            {
                name: 'United States',
                code: 'US',
                states: [
                    { name: 'Alabama', code: 'AL' },
                    { name: 'Alaska', code: 'AK' },
                    { name: 'Arizona', code: 'AZ' },
                    { name: 'California', code: 'CA' },
                    { name: 'Florida', code: 'FL' },
                    { name: 'Georgia', code: 'GA' },
                    { name: 'New York', code: 'NY' },
                    { name: 'Texas', code: 'TX' }
                ]
            },
            {
                name: 'United Kingdom',
                code: 'GB',
                states: [
                    { name: 'England', code: 'ENG' },
                    { name: 'Scotland', code: 'SCT' },
                    { name: 'Wales', code: 'WLS' },
                    { name: 'Northern Ireland', code: 'NIR' }
                ]
            }
        ];

        await Country.insertMany(defaultCountries, { ordered: false });
        
        res.status(200).json({
            success: true,
            message: 'Countries seeded successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({
                success: true,
                message: 'Countries already exist'
            });
        }
        console.error('Error seeding countries:', error);
        res.status(500).json({
            success: false,
            message: 'Error seeding countries'
        });
    }
};
