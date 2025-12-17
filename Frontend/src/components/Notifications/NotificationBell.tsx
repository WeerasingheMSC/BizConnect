import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheck, FaTrash, FaTimes } from 'react-icons/fa';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } from '../../services/notificationService';
import type { Notification } from '../../services/notificationService';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell = ({ className = '' }: NotificationBellProps) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown]);

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      if (response.success && response.count !== undefined) {
        setUnreadCount(response.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications({ limit: 10 });
      if (response.success && response.notifications) {
        setNotifications(response.notifications);
        if (response.unreadCount !== undefined) {
          setUnreadCount(response.unreadCount);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await markAsRead(id);
      await fetchNotifications();
      await fetchUnreadCount();
      
      if (link) {
        setShowDropdown(false);
        navigate(link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await fetchNotifications();
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'business_bookmarked':
        return '🔖';
      case 'business_viewed':
        return '👁️';
      case 'business_created':
        return '🎉';
      case 'business_updated':
        return '✏️';
      case 'profile_updated':
        return '👤';
      default:
        return '🔔';
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-700 hover:text-amber-600 transition-colors"
      >
        <FaBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
              <div className="flex items-center space-x-2">
                {notifications.some(n => !n.isRead) && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                    title="Mark all as read"
                  >
                    <FaCheck className="inline mr-1" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="mt-2">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FaBell className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleMarkAsRead(notification._id, notification.link)}
                      className={`p-4 cursor-pointer transition-colors ${
                        notification.isRead
                          ? 'bg-white hover:bg-gray-50'
                          : 'bg-amber-50 hover:bg-amber-100'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className="font-semibold text-gray-800 text-sm">
                              {notification.title}
                            </p>
                            <button
                              onClick={(e) => handleDelete(e, notification._id)}
                              className="text-gray-400 hover:text-red-500 ml-2"
                              title="Delete notification"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          {notification.relatedBusiness && (
                            <div className="flex items-center space-x-2 mt-2">
                              {notification.relatedBusiness.logo && (
                                <img
                                  src={notification.relatedBusiness.logo}
                                  alt=""
                                  className="w-6 h-6 rounded object-cover"
                                />
                              )}
                              <span className="text-xs text-amber-600 font-semibold">
                                {notification.relatedBusiness.businessName}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {getTimeAgo(notification.createdAt)}
                            </span>
                            {!notification.isRead && (
                              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    // Navigate to full notifications page (we can create this later)
                  }}
                  className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
