import express from 'express';
import { createUser,getUser,getAllUsers,updateUser,deleteUser } from '../controllers/userController.js';

const router = express.Router();

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
