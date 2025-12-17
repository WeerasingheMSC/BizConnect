import express from 'express';
import { createUser,getUser,getAllUsers,updateUser,deleteUser, addBookmark, removeBookmark, getBookmarks, checkBookmark, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/profile', protect, getUserProfile);
router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks/:businessId', protect, addBookmark);
router.delete('/bookmarks/:businessId', protect, removeBookmark);
router.get('/bookmarks/check/:businessId', protect, checkBookmark);

// Route to create a new user
router.post('/users', createUser);
// Route to get all users
router.get('/users', getAllUsers);
// Route to get a user by ID
router.get('/users/:id', getUser);
// Route to update a user by ID
router.put('/users/:id', updateUser);
// Route to delete a user by ID
router.delete('/users/:id', deleteUser);

export default router;
