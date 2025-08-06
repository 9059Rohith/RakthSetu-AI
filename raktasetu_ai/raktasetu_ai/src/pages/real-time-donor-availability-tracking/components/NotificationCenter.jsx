import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NotificationCenter = ({ notifications, onMarkAsRead, onMarkAllAsRead, onNotificationAction }) => {
  const [filter, setFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      type: 'status_update',
      priority: 'high',
      title: 'Donor En Route',
      message: 'Rajesh Kumar is traveling to hospital. ETA: 15 minutes.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isRead: false,
      icon: 'Car',
      actionable: true,
      actions: [
        { label: 'Track Location', action: 'track_donor' },
        { label: 'Contact Donor', action: 'contact_donor' }
      ]
    },
    {
      id: 2,
      type: 'traffic_alert',
      priority: 'medium',
      title: 'Traffic Delay Alert',
      message: 'Heavy traffic detected on route. Estimated delay: +10 minutes.',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      isRead: false,
      icon: 'AlertTriangle',
      actionable: true,
      actions: [
        { label: 'Activate Backup', action: 'activate_backup' },
        { label: 'Notify Hospital', action: 'notify_hospital' }
      ]
    },
    {
      id: 3,
      type: 'weather_update',
      priority: 'low',
      title: 'Weather Update',
      message: 'Light rain expected. No significant impact on travel time.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      isRead: true,
      icon: 'Cloud',
      actionable: false
    },
    {
      id: 4,
      type: 'backup_ready',
      priority: 'medium',
      title: 'Backup Donor Confirmed',
      message: 'Priya Sharma confirmed as backup donor. Ready to activate if needed.',
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      isRead: false,
      icon: 'UserCheck',
      actionable: true,
      actions: [
        { label: 'View Profile', action: 'view_profile' },
        { label: 'Send Message', action: 'send_message' }
      ]
    },
    {
      id: 5,
      type: 'hospital_update',
      priority: 'high',
      title: 'Room Assignment',
      message: 'Patient room assigned: Ward 3, Bed 12. Staff notified.',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: true,
      icon: 'Building2',
      actionable: false
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-error bg-error/5';
      case 'medium':
        return 'border-l-warning bg-warning/5';
      case 'low':
        return 'border-l-muted-foreground bg-muted/5';
      default:
        return 'border-l-border bg-card';
    }
  };

  const getIconColor = (priority, isRead) => {
    if (isRead) return 'text-muted-foreground';
    
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const filteredNotifications = mockNotifications?.filter(notification => {
    if (filter === 'unread') return !notification?.isRead;
    if (filter === 'high') return notification?.priority === 'high';
    return true;
  });

  const unreadCount = mockNotifications?.filter(n => !n?.isRead)?.length;
  const displayedNotifications = isExpanded ? filteredNotifications : filteredNotifications?.slice(0, 3);

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="Bell" size={20} className="text-foreground" />
            <h3 className="text-lg font-semibold text-card-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onMarkAllAsRead}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Mark all read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1">
          {[
            { key: 'all', label: 'All', count: mockNotifications?.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'high', label: 'Priority', count: mockNotifications?.filter(n => n?.priority === 'high')?.length }
          ]?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setFilter(tab?.key)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === tab?.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab?.label} ({tab?.count})
            </button>
          ))}
        </div>
      </div>
      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {displayedNotifications?.length > 0 ? (
          <div className="divide-y divide-border">
            {displayedNotifications?.map((notification) => (
              <div
                key={notification?.id}
                className={`p-4 border-l-4 ${getPriorityColor(notification?.priority)} ${
                  !notification?.isRead ? 'bg-opacity-100' : 'bg-opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${getIconColor(notification?.priority, notification?.isRead)}`}>
                    <Icon name={notification?.icon} size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium ${notification?.isRead ? 'text-muted-foreground' : 'text-card-foreground'}`}>
                        {notification?.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification?.timestamp)}
                        </span>
                        {!notification?.isRead && (
                          <button
                            onClick={() => onMarkAsRead(notification?.id)}
                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm ${notification?.isRead ? 'text-muted-foreground' : 'text-card-foreground'}`}>
                      {notification?.message}
                    </p>

                    {/* Action Buttons */}
                    {notification?.actionable && notification?.actions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {notification?.actions?.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => onNotificationAction(notification?.id, action?.action)}
                            className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-md hover:bg-primary/20 transition-colors"
                          >
                            {action?.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="Bell" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No notifications found</p>
          </div>
        )}
      </div>
      {/* Expand/Collapse Button */}
      {filteredNotifications?.length > 3 && (
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            <span>{isExpanded ? 'Show Less' : `Show ${filteredNotifications?.length - 3} More`}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;