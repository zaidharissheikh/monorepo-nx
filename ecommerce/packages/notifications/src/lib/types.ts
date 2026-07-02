export const NOTIFICATION_TYPES = {
  ACCOUNT_CREATED: 'account_created',
  ORDER_PLACED: 'order_placed',
  PAYMENT_SUCCESS: 'payment_success',
  ORDER_STATUS_UPDATED: 'order_status_updated',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  NEW_USER_REGISTERED: 'new_user_registered',
  NEW_ORDER_PLACED: 'new_order_placed',
  PAYMENT_COMPLETED: 'payment_completed',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export const SOCKET_EVENTS = {
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_JOIN: 'notification:join',
} as const;
