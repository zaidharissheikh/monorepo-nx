import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect } from '../middleware/auth';
import * as notificationService from '../services/notificationService';
import { NOTIFICATION_TYPES } from '@ecommerce/notifications';

const router = express.Router();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
router.post('/register', async (req: Request, res: Response): Promise<any> => {
  const { name, email, password, role } = req.body;

  try {
    const emailHash = require('crypto').createHash('sha256').update(email.toLowerCase()).digest('hex');
    const userExists = await User.findOne({ $or: [{ emailHash }, { email }, { email: email.toLowerCase() }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
    });

    if (user) {
      const userId = user._id.toString();

      // Send notifications (fire-and-forget)
      notificationService.createNotification({
        userId,
        title: 'Welcome!',
        message: `Your account has been created successfully. Welcome to StoreFront, ${name}!`,
        type: NOTIFICATION_TYPES.ACCOUNT_CREATED,
      }).catch(err => console.error('[Auth] Notification error:', err));

      notificationService.notifyAdmins({
        title: 'New User Registered',
        message: `${name} (${email}) has registered a new account.`,
        type: NOTIFICATION_TYPES.NEW_USER_REGISTERED,
      }).catch(err => console.error('[Auth] Admin notification error:', err));

      res.status(201).json({
        _id: user._id,
        name: name,
        email: email,
        role: user.role,
        token: generateToken(userId),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Auth user & get token
// @route   POST /auth/login
// @access  Public
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const emailHash = require('crypto').createHash('sha256').update(email.toLowerCase()).digest('hex');
    const user = await User.findOne({ $or: [{ emailHash }, { email }, { email: email.toLowerCase() }] });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user profile
// @route   GET /auth/profile
// @access  Private
router.get('/profile', protect, async (req: Request, res: Response): Promise<any> => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;
