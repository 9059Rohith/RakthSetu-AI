import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onFindBackupDonor, onScheduleAppointment, onEmergencyRequest }) => {
  const actions = [
    {
      id: 'backup-donor',
      label: 'Find Backup Donor',
      icon: 'Users',
      variant: 'outline',
      description: 'Search for alternative donors',
      onClick: onFindBackupDonor
    },
    {
      id: 'schedule',
      label: 'Schedule Appointment',
      icon: 'Calendar',
      variant: 'default',
      description: 'Book transfusion slot',
      onClick: onScheduleAppointment
    },
    {
      id: 'emergency',
      label: 'Emergency Request',
      icon: 'AlertTriangle',
      variant: 'destructive',
      description: 'Urgent blood needed',
      onClick: onEmergencyRequest,
      urgent: true
    }
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions?.map((action) => (
          <div key={action?.id} className="group">
            <Button
              variant={action?.variant}
              size="lg"
              fullWidth
              iconName={action?.icon}
              iconPosition="left"
              className={`justify-start h-auto py-4 ${action?.urgent ? 'animate-pulse-soft' : ''}`}
              onClick={action?.onClick}
            >
              <div className="flex flex-col items-start ml-2">
                <span className="font-medium">{action?.label}</span>
                <span className="text-xs opacity-80 font-normal">{action?.description}</span>
              </div>
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-muted-foreground">System Status</span>
        </div>
        <p className="text-sm text-muted-foreground">
          AI matching active • 24/7 monitoring • Emergency support available
        </p>
      </div>
    </div>
  );
};

export default QuickActions;