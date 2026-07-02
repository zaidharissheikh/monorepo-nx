import Notification from '../models/Notification';
import User from '../models/User';
import { getIO } from '../socket';
import { NotificationType, SOCKET_EVENTS, INotification } from '@ecommerce/notifications';

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}

const toClientNotification = (doc: any): INotification => ({
  _id: doc._id.toString(),
  userId: doc.userId.toString(),
  title: doc.title,
  message: doc.message,
  type: doc.type,
  read: doc.read,
  createdAt: doc.createdAt.toISOString(),
});

export const createNotification = async (data: CreateNotificationInput): Promise<INotification> => {
  const notification = await Notification.create({
    userId: data.userId,
    title: data.title,
    message: data.message,
    type: data.type,
  });

  const clientNotification = toClientNotification(notification);

  try {
    const io = getIO();
    io.to(`user:${data.userId}`).emit(SOCKET_EVENTS.NOTIFICATION_NEW, clientNotification);
  } catch (error) {
    console.error('[NotificationService] Socket.IO emit failed:', error);
  }

  return clientNotification;
};

export const notifyAdmins = async (data: Omit<CreateNotificationInput, 'userId'>): Promise<void> => {
  const admins = await User.find({ role: 'admin' }).select('_id');

  for (const admin of admins) {
    await createNotification({
      ...data,
      userId: admin._id.toString(),
    });
  }
};

export const getUserNotifications = async (userId: string): Promise<INotification[]> => {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return notifications.map(toClientNotification);
};

export const markAsRead = async (notificationId: string, userId: string): Promise<INotification | null> => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );

  if (!notification) return null;
  return toClientNotification(notification);
};

export const markAllRead = async (userId: string): Promise<number> => {
  const result = await Notification.updateMany(
    { userId, read: false },
    { read: true }
  );
  return result.modifiedCount;
};

export const deleteNotification = async (notificationId: string, userId: string): Promise<boolean> => {
  const result = await Notification.findOneAndDelete({
    _id: notificationId,
    userId,
  });
  return !!result;
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  return Notification.countDocuments({ userId, read: false });
};
