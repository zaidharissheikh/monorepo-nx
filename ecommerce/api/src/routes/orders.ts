import express, { Request, Response } from 'express';
import Order from '../models/Order';
import { protect, admin } from '../middleware/auth';
import * as notificationService from '../services/notificationService';
import { NOTIFICATION_TYPES } from '@ecommerce/notifications';

const router = express.Router();

// @desc    Create new order
// @route   POST /orders
// @access  Private
router.post('/', protect, async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    const orderId = order._id.toString();
    const shortId = orderId.slice(-8).toUpperCase();

    // Notify customer
    notificationService.createNotification({
      userId: req.user._id.toString(),
      title: 'Order Placed',
      message: `Your order #${shortId} has been placed successfully. Total: $${totalPrice.toFixed(2)}`,
      type: NOTIFICATION_TYPES.ORDER_PLACED,
    }).catch(err => console.error('[Orders] Notification error:', err));

    // Notify admins
    notificationService.notifyAdmins({
      title: 'New Order Placed',
      message: `${req.user.name} placed a new order #${shortId} worth $${totalPrice.toFixed(2)}.`,
      type: NOTIFICATION_TYPES.NEW_ORDER_PLACED,
    }).catch(err => console.error('[Orders] Admin notification error:', err));

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating order' });
  }
});

// @desc    Get logged-in user's orders
// @route   GET /orders/myorders
// @access  Private
router.get('/myorders', protect, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching orders' });
  }
});

// @desc    Get all orders
// @route   GET /orders
// @access  Private/Admin
router.get('/', protect, admin, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching orders' });
  }
});

// @desc    Update order status
// @route   PUT /orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req: Request, res: Response): Promise<any> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status;

    if (req.body.status === 'Delivered') {
      order.paidAt = new Date();
    }

    const updatedOrder = await order.save();

    const shortId = order._id.toString().slice(-8).toUpperCase();
    const customerId = order.user.toString();

    // Notify customer based on status
    if (req.body.status === 'Shipped') {
      notificationService.createNotification({
        userId: customerId,
        title: 'Order Shipped',
        message: `Your order #${shortId} has been shipped! It's on its way to you.`,
        type: NOTIFICATION_TYPES.ORDER_SHIPPED,
      }).catch(err => console.error('[Orders] Notification error:', err));
    } else if (req.body.status === 'Delivered') {
      notificationService.createNotification({
        userId: customerId,
        title: 'Order Delivered',
        message: `Your order #${shortId} has been delivered. Enjoy your purchase!`,
        type: NOTIFICATION_TYPES.ORDER_DELIVERED,
      }).catch(err => console.error('[Orders] Notification error:', err));
    } else {
      notificationService.createNotification({
        userId: customerId,
        title: 'Order Status Updated',
        message: `Your order #${shortId} status has been updated to "${req.body.status}".`,
        type: NOTIFICATION_TYPES.ORDER_STATUS_UPDATED,
      }).catch(err => console.error('[Orders] Notification error:', err));
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating order' });
  }
});

// @desc    Mark order as paid (mock payment)
// @route   PUT /orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req: Request, res: Response): Promise<any> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the order belongs to the requesting user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentMethod = req.body.paymentMethod || 'Mock Card';

    const updatedOrder = await order.save();

    const shortId = order._id.toString().slice(-8).toUpperCase();

    // Notify customer
    notificationService.createNotification({
      userId: req.user._id.toString(),
      title: 'Payment Successful',
      message: `Payment for order #${shortId} was successful. Amount: $${order.totalPrice.toFixed(2)}`,
      type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
    }).catch(err => console.error('[Orders] Notification error:', err));

    // Notify admins
    notificationService.notifyAdmins({
      title: 'Payment Completed',
      message: `Payment of $${order.totalPrice.toFixed(2)} received for order #${shortId} from ${req.user.name}.`,
      type: NOTIFICATION_TYPES.PAYMENT_COMPLETED,
    }).catch(err => console.error('[Orders] Admin notification error:', err));

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error processing payment' });
  }
});

export default router;

