import axios from '../utils/axios';

export interface Notification {
  _id: string;
  recipient: string;
  sender?: {
    _id: string;
    name: string;
    email: string;
  };
  type: 'business_created' | 'business_updated' | 'business_bookmarked' | 'business_viewed' | 'profile_updated' | 'system';
  title: string;
  message: string;
  relatedBusiness?: {
    _id: string;
    businessName: string;
    logo?: string;
  };
  isRead: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  notifications?: Notification[];
  notification?: Notification;
  unreadCount?: number;
  totalPages?: number;
  currentPage?: number;
  total?: number;
  count?: number;
}

// Get all notifications
export const getNotifications = async (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<NotificationResponse> => {
  const response = await axios.get('/notifications', { params });
  return response.data;
};

// Get unread notification count
export const getUnreadCount = async (): Promise<NotificationResponse> => {
  const response = await axios.get('/notifications/count');
  return response.data;
};

// Mark notification as read
export const markAsRead = async (id: string): Promise<NotificationResponse> => {
  const response = await axios.put(`/notifications/${id}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async (): Promise<NotificationResponse> => {
  const response = await axios.put('/notifications/read-all');
  return response.data;
};

// Delete notification
export const deleteNotification = async (id: string): Promise<NotificationResponse> => {
  const response = await axios.delete(`/notifications/${id}`);
  return response.data;
};
