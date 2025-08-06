import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'caregiver', emergencyActive = false, notificationCount = 0, onEmergencyTrigger }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/patient-caregiver-dashboard', 
      icon: 'LayoutDashboard',
      roles: ['caregiver', 'admin'],
      primary: true
    },
    { 
      label: 'Donors', 
      path: '/blood-donor-registration-profile', 
      icon: 'Users',
      roles: ['caregiver', 'donor', 'admin'],
      primary: true,
      submenu: [
        { label: 'Registration', path: '/blood-donor-registration-profile' },
        { label: 'AI Matching', path: '/ai-powered-donor-matching' },
        { label: 'Availability', path: '/real-time-donor-availability-tracking' }
      ]
    },
    { 
      label: 'Hospital', 
      path: '/hospital-administrator-dashboard', 
      icon: 'Building2',
      roles: ['admin', 'hospital'],
      primary: true
    },
    { 
      label: 'Emergency', 
      path: '/emergency-blood-request-system', 
      icon: 'AlertTriangle',
      roles: ['caregiver', 'admin', 'hospital', 'donor'],
      primary: true,
      emergency: true
    }
  ];

  const secondaryItems = [
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help', path: '/help', icon: 'HelpCircle' },
    { label: 'Profile', path: '/profile', icon: 'User' }
  ];

  const filteredPrimaryItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole) && item?.primary
  );

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMenuOpen(false);
  };

  const handleEmergencyClick = () => {
    if (onEmergencyTrigger) {
      onEmergencyTrigger();
    }
    handleNavigation('/emergency-blood-request-system');
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
    <>
      {/* Emergency Alert Banner */}
      {emergencyActive && (
        <div className="bg-error text-error-foreground px-4 py-2 text-sm font-medium text-center animate-pulse-soft">
          <div className="flex items-center justify-center gap-2">
            <Icon name="AlertTriangle" size={16} />
            <span>Critical Blood Shortage Alert - Immediate Donors Needed</span>
            <Button 
              variant="ghost" 
              size="xs" 
              className="text-error-foreground hover:bg-error/20 ml-2"
              onClick={handleEmergencyClick}
            >
              Respond
            </Button>
          </div>
        </div>
      )}
      {/* Main Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Droplets" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-text-primary">RaktaSetu</span>
                <span className="text-xs text-text-secondary -mt-1">AI</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {filteredPrimaryItems?.slice(0, 4)?.map((item) => (
              <div key={item?.path} className="relative group">
                <Button
                  variant={item?.emergency ? "destructive" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 px-3 py-2 ${
                    item?.emergency ? 'animate-pulse-soft' : ''
                  }`}
                  onClick={() => handleNavigation(item?.path)}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </Button>
                
                {/* Submenu */}
                {item?.submenu && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {item?.submenu?.map((subItem) => (
                        <button
                          key={subItem?.path}
                          className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                          onClick={() => handleNavigation(subItem?.path)}
                        >
                          {subItem?.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* More Menu */}
            {filteredPrimaryItems?.length > 4 && (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3 py-2">
                  <Icon name="MoreHorizontal" size={16} />
                  <span>More</span>
                </Button>
                <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {filteredPrimaryItems?.slice(4)?.map((item) => (
                      <button
                        key={item?.path}
                        className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        onClick={() => handleNavigation(item?.path)}
                      >
                        <Icon name={item?.icon} size={16} />
                        {item?.label}
                      </button>
                    ))}
                    <div className="border-t border-border my-1"></div>
                    {secondaryItems?.map((item) => (
                      <button
                        key={item?.path}
                        className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        onClick={() => handleNavigation(item?.path)}
                      >
                        <Icon name={item?.icon} size={16} />
                        {item?.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Role Context Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-text-secondary">
                {getRoleDisplayName(userRole)}
              </span>
            </div>

            {/* Notification Center */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Icon name="Bell" size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>

              {/* Notification Panel */}
              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-md shadow-medium z-50">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-popover-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notificationCount > 0 ? (
                      <div className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-3 p-2 hover:bg-muted rounded">
                          <div className="w-2 h-2 bg-warning rounded-full"></div>
                          <div>
                            <p className="font-medium">Donor Match Found</p>
                            <p className="text-xs text-muted-foreground">2 minutes ago</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-surface">
            <nav className="px-4 py-2 space-y-1">
              {filteredPrimaryItems?.map((item) => (
                <button
                  key={item?.path}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                    item?.emergency 
                      ? 'bg-error text-error-foreground' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => handleNavigation(item?.path)}
                >
                  <Icon name={item?.icon} size={18} />
                  <span className="font-medium">{item?.label}</span>
                </button>
              ))}
              
              <div className="border-t border-border my-2"></div>
              
              {secondaryItems?.map((item) => (
                <button
                  key={item?.path}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => handleNavigation(item?.path)}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
      {/* Quick Action Floating Button - Mobile Only */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        <Button
          variant="destructive"
          size="icon"
          className="w-14 h-14 rounded-full shadow-medium animate-pulse-soft"
          onClick={handleEmergencyClick}
        >
          <Icon name="Phone" size={24} />
        </Button>
      </div>
    </>
  );
};

export default Header;