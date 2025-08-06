import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities, onViewAll }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'donor_confirmed':
        return 'UserCheck';
      case 'appointment_scheduled':
        return 'Calendar';
      case 'match_found':
        return 'Target';
      case 'reminder':
        return 'Bell';
      case 'system_update':
        return 'Settings';
      default:
        return 'Info';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'donor_confirmed':
        return 'text-success';
      case 'appointment_scheduled':
        return 'text-primary';
      case 'match_found':
        return 'text-warning';
      case 'reminder':
        return 'text-error';
      case 'system_update':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getActivityBgColor = (type) => {
    switch (type) {
      case 'donor_confirmed':
        return 'bg-success/10';
      case 'appointment_scheduled':
        return 'bg-primary/10';
      case 'match_found':
        return 'bg-warning/10';
      case 'reminder':
        return 'bg-error/10';
      case 'system_update':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
        <button
          className="text-sm text-primary hover:text-primary/80 transition-colors"
          onClick={onViewAll}
        >
          View All
        </button>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex gap-3">
            <div className={`w-8 h-8 rounded-full ${getActivityBgColor(activity?.type)} flex items-center justify-center shrink-0`}>
              <Icon 
                name={getActivityIcon(activity?.type)} 
                size={14} 
                className={getActivityColor(activity?.type)}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground leading-relaxed">
                    {activity?.title}
                  </p>
                  {activity?.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity?.description}
                    </p>
                  )}
                  {activity?.metadata && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {activity?.metadata?.donor && (
                        <span>Donor: {activity?.metadata?.donor}</span>
                      )}
                      {activity?.metadata?.hospital && (
                        <span>Hospital: {activity?.metadata?.hospital}</span>
                      )}
                      {activity?.metadata?.compatibility && (
                        <span>Match: {activity?.metadata?.compatibility}%</span>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(activity?.timestamp)}
                </span>
              </div>

              {activity?.actionRequired && (
                <div className="mt-2">
                  <button className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-md hover:bg-warning/20 transition-colors">
                    Action Required
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {activities?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;