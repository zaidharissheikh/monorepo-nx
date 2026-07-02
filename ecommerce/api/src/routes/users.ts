import express, { Request, Response } from 'express';
import User from '../models/User';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// @desc    Get all users
// @route   GET /users
// @access  Private/Admin
router.get('/', protect, admin, async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching users' });
  }
});

// @desc    Delete a user
// @route   DELETE /users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting user' });
  }
});

export default router;
