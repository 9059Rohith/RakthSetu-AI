import React from 'react';
import Icon from '../../../components/AppIcon';

const BottomNavigation = ({ activeTab, onTabChange, notificationCounts = {} }) => {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/patient-caregiver-dashboard',
      notifications: notificationCounts?.dashboard || 0
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: 'Calendar',
      path: '/appointments',
      notifications: notificationCounts?.appointments || 0
    },
    {
      id: 'donors',
      label: 'Donors',
      icon: 'Users',
      path: '/blood-donor-registration-profile',
      notifications: notificationCounts?.donors || 0
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: 'AlertTriangle',
      path: '/emergency-blood-request-system',
      notifications: notificationCounts?.emergency || 0,
      urgent: true
    }
  ];

  const handleTabClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab?.id, tab?.path);
    } else {
      window.location.href = tab?.path;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab?.id
                ? tab?.urgent
                  ? 'text-error bg-error/10' :'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground'
            } ${tab?.urgent ? 'animate-pulse-soft' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            <div className="relative">
              <Icon 
                name={tab?.icon} 
                size={20} 
                className={activeTab === tab?.id && tab?.urgent ? 'text-error' : ''}
              />
              {tab?.notifications > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {tab?.notifications > 9 ? '9+' : tab?.notifications}
                </div>
              )}
            </div>
            <span className="text-xs font-medium">{tab?.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;