import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onEmergencyRequest, onBulkNotify, onScheduleAppointment, onGenerateReport }) => {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');

  const quickActionItems = [
    {
      id: 'emergency',
      title: 'Emergency Blood Request',
      description: 'Trigger critical blood shortage alert',
      icon: 'AlertTriangle',
      color: 'bg-error text-error-foreground',
      action: () => setIsEmergencyModalOpen(true)
    },
    {
      id: 'bulk-notify',
      title: 'Bulk Donor Notification',
      description: 'Send notifications to multiple donors',
      icon: 'Send',
      color: 'bg-primary text-primary-foreground',
      action: onBulkNotify
    },
    {
      id: 'schedule',
      title: 'Mass Appointment Scheduling',
      description: 'Schedule multiple patient appointments',
      icon: 'Calendar',
      color: 'bg-success text-success-foreground',
      action: onScheduleAppointment
    },
    {
      id: 'report',
      title: 'Generate Analytics Report',
      description: 'Export comprehensive hospital report',
      icon: 'FileText',
      color: 'bg-accent text-accent-foreground',
      action: onGenerateReport
    }
  ];

  const emergencyTypes = [
    { value: 'critical-shortage', label: 'Critical Blood Shortage', icon: 'AlertTriangle' },
    { value: 'mass-casualty', label: 'Mass Casualty Event', icon: 'Ambulance' },
    { value: 'equipment-failure', label: 'Equipment Failure', icon: 'AlertCircle' },
    { value: 'donor-shortage', label: 'Donor Shortage', icon: 'Users' }
  ];

  const handleEmergencySubmit = () => {
    if (emergencyType) {
      onEmergencyRequest(emergencyType);
      setIsEmergencyModalOpen(false);
      setEmergencyType('');
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Frequently used administrative functions
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActionItems?.map((item) => (
              <button
                key={item?.id}
                onClick={item?.action}
                className={`p-4 rounded-lg text-left transition-all duration-200 hover:shadow-md hover:scale-105 ${item?.color}`}
              >
                <div className="flex items-start gap-3">
                  <Icon name={item?.icon} size={24} className="shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{item?.title}</h3>
                    <p className="text-sm opacity-90">{item?.description}</p>
                  </div>
                  <Icon name="ArrowRight" size={16} className="shrink-0 mt-1 opacity-70" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Actions */}
        <div className="p-6 border-t border-border bg-muted/30">
          <h3 className="font-medium text-foreground mb-3">Recent Actions</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Bulk notification sent to 25 O+ donors</span>
              <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Weekly analytics report generated</span>
              <span className="text-xs text-muted-foreground ml-auto">15 min ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Emergency alert triggered for A- shortage</span>
              <span className="text-xs text-muted-foreground ml-auto">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
      {/* Emergency Request Modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Emergency Alert</h3>
                <button
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Select the type of emergency to trigger appropriate response protocols.
              </p>

              <div className="space-y-3">
                {emergencyTypes?.map((type) => (
                  <label
                    key={type?.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      emergencyType === type?.value
                        ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="emergencyType"
                      value={type?.value}
                      checked={emergencyType === type?.value}
                      onChange={(e) => setEmergencyType(e?.target?.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-primary"
                    />
                    <Icon name={type?.icon} size={20} className="text-error" />
                    <span className="font-medium text-foreground">{type?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleEmergencySubmit}
                disabled={!emergencyType}
                className="flex-1"
              >
                <Icon name="AlertTriangle" size={16} className="mr-2" />
                Trigger Alert
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;