import express, { Request, Response } from 'express';
import { protect } from '../middleware/auth';
import * as notificationService from '../services/notificationService';

const router = express.Router();

// @desc    Get current user's notifications
// @route   GET /notifications
// @access  Private
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user._id.toString());
    const unreadCount = await notificationService.getUnreadCount(req.user._id.toString());
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching notifications' });
  }
});

// @desc    Mark a notification as read
// @route   PATCH /notifications/:id/read
// @access  Private
router.patch('/:id/read', protect, async (req: Request, res: Response): Promise<any> => {
  try {
    const notification = await notificationService.markAsRead(req.params.id as string, req.user._id.toString());

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server Error marking notification as read' });
  }
});

// @desc    Mark all notifications as read
// @route   PATCH /notifications/read-all
// @access  Private
router.patch('/read-all', protect, async (req: Request, res: Response) => {
  try {
    const modifiedCount = await notificationService.markAllRead(req.user._id.toString());
    res.json({ message: 'All notifications marked as read', modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error marking all notifications as read' });
  }
});

// @desc    Delete a notification
// @route   DELETE /notifications/:id
// @access  Private
router.delete('/:id', protect, async (req: Request, res: Response): Promise<any> => {
  try {
    const deleted = await notificationService.deleteNotification(req.params.id as string, req.user._id.toString());

    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting notification' });
  }
});

export default router;
