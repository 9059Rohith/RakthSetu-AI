import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ 
  isCollapsed = false, 
  userRole = 'caregiver', 
  emergencyActive = false, 
  notificationCount = 0,
  onToggleCollapse,
  onEmergencyTrigger 
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/patient-caregiver-dashboard', 
      icon: 'LayoutDashboard',
      roles: ['caregiver', 'admin'],
      description: 'Patient transfusion management'
    },
    { 
      label: 'Donors', 
      path: '/blood-donor-registration-profile', 
      icon: 'Users',
      roles: ['caregiver', 'donor', 'admin'],
      description: 'Donor management system',
      submenu: [
        { 
          label: 'Registration', 
          path: '/blood-donor-registration-profile',
          icon: 'UserPlus',
          description: 'Register new donors'
        },
        { 
          label: 'AI Matching', 
          path: '/ai-powered-donor-matching',
          icon: 'Brain',
          description: 'Smart donor matching'
        },
        { 
          label: 'Availability', 
          path: '/real-time-donor-availability-tracking',
          icon: 'Clock',
          description: 'Real-time tracking'
        }
      ]
    },
    { 
      label: 'Hospital', 
      path: '/hospital-administrator-dashboard', 
      icon: 'Building2',
      roles: ['admin', 'hospital'],
      description: 'Administrative control center'
    },
    { 
      label: 'Emergency', 
      path: '/emergency-blood-request-system', 
      icon: 'AlertTriangle',
      roles: ['caregiver', 'admin', 'hospital', 'donor'],
      description: 'Critical blood requests',
      emergency: true
    }
  ];

  const secondaryItems = [
    { label: 'Settings', path: '/settings', icon: 'Settings', description: 'System preferences' },
    { label: 'Help', path: '/help', icon: 'HelpCircle', description: 'Support & documentation' },
    { label: 'Profile', path: '/profile', icon: 'User', description: 'User profile settings' }
  ];

  const filteredItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleEmergencyClick = () => {
    if (onEmergencyTrigger) {
      onEmergencyTrigger();
    }
    handleNavigation('/emergency-blood-request-system');
  };

  const toggleSubmenu = (index) => {
    if (isCollapsed) return;
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      caregiver: 'Caregiver',
      donor: 'Donor',
      admin: 'Administrator',
      hospital: 'Hospital Staff'
    };
    return roleNames?.[role] || 'User';
  };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-surface border-r border-border z-30 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Droplets" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-text-primary">RaktaSetu</span>
                <span className="text-xs text-text-secondary -mt-1">AI</span>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="shrink-0"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>

        {/* Role Context Indicator */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-text-secondary">
                {getRoleDisplayName(userRole)}
              </span>
            </div>
          </div>
        )}

        {/* Emergency Alert */}
        {emergencyActive && (
          <div className="p-4">
            <div className={`bg-error text-error-foreground rounded-lg p-3 animate-pulse-soft ${
              isCollapsed ? 'text-center' : ''
            }`}>
              <div className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={16} />
                {!isCollapsed && (
                  <div className="flex-1">
                    <p className="text-sm font-medium">Critical Alert</p>
                    <p className="text-xs opacity-90">Blood shortage detected</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <Button 
                  variant="ghost" 
                  size="xs" 
                  className="w-full mt-2 text-error-foreground hover:bg-error/20"
                  onClick={handleEmergencyClick}
                >
                  Respond Now
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredItems?.map((item, index) => (
            <div key={item?.path}>
              <div
                className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  item?.emergency 
                    ? 'bg-error text-error-foreground hover:bg-error/90' 
                    : 'text-foreground hover:bg-muted'
                } ${item?.submenu && !isCollapsed ? 'hover:bg-muted/50' : ''}`}
                onClick={() => item?.submenu ? toggleSubmenu(index) : handleNavigation(item?.path)}
              >
                <Icon 
                  name={item?.icon} 
                  size={18} 
                  className={item?.emergency ? 'animate-pulse-soft' : ''}
                />
                
                {!isCollapsed && (
                  <>
                    <div className="flex-1">
                      <span className="font-medium">{item?.label}</span>
                      <p className="text-xs opacity-70 mt-0.5">{item?.description}</p>
                    </div>
                    
                    {item?.submenu && (
                      <Icon 
                        name="ChevronDown" 
                        size={16} 
                        className={`transition-transform duration-200 ${
                          activeSubmenu === index ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item?.label}
                  </div>
                )}
              </div>

              {/* Submenu */}
              {item?.submenu && !isCollapsed && activeSubmenu === index && (
                <div className="ml-6 mt-2 space-y-1 animate-slide-in">
                  {item?.submenu?.map((subItem) => (
                    <div
                      key={subItem?.path}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => handleNavigation(subItem?.path)}
                    >
                      <Icon name={subItem?.icon} size={16} />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{subItem?.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{subItem?.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Action Emergency Button */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <Button
              variant="destructive"
              className="w-full animate-pulse-soft"
              onClick={handleEmergencyClick}
            >
              <Icon name="Phone" size={16} className="mr-2" />
              Emergency Request
            </Button>
          </div>
        )}

        {/* Notification Count */}
        {notificationCount > 0 && (
          <div className="p-4">
            <div className={`flex items-center gap-2 px-3 py-2 bg-warning/10 text-warning rounded-lg ${
              isCollapsed ? 'justify-center' : ''
            }`}>
              <Icon name="Bell" size={16} />
              {!isCollapsed && (
                <span className="text-sm font-medium">
                  {notificationCount} new notification{notificationCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Secondary Navigation */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border space-y-1">
            {secondaryItems?.map((item) => (
              <div
                key={item?.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                onClick={() => handleNavigation(item?.path)}
              >
                <Icon name={item?.icon} size={16} />
                <div className="flex-1">
                  <span className="text-sm">{item?.label}</span>
                  <p className="text-xs opacity-70 mt-0.5">{item?.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;