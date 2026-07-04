import express, { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent orders for the activity feed
    const recentOrders = await Order.find({})
      .populate('user', 'name __enc_name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching stats' });
  }
});

export default router;
