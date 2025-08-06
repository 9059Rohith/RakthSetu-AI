import React from 'react';
import Icon from '../../../components/AppIcon';

const AppointmentTimeline = ({ appointment, onContactDonor, onViewDetails }) => {
  const timelineStages = [
    {
      id: 'confirmed',
      label: 'Confirmation Received',
      icon: 'CheckCircle',
      status: 'completed',
      time: '2 hours ago',
      description: 'Donor confirmed availability'
    },
    {
      id: 'traveling',
      label: 'Traveling to Hospital',
      icon: 'Car',
      status: 'active',
      time: 'ETA: 15 mins',
      description: 'En route via optimal path'
    },
    {
      id: 'arrived',
      label: 'Arrived at Location',
      icon: 'MapPin',
      status: 'pending',
      time: 'Expected: 3:30 PM',
      description: 'Hospital check-in pending'
    },
    {
      id: 'donation',
      label: 'Donation in Progress',
      icon: 'Activity',
      status: 'pending',
      time: 'Expected: 4:00 PM',
      description: 'Blood collection phase'
    },
    {
      id: 'completed',
      label: 'Process Complete',
      icon: 'Heart',
      status: 'pending',
      time: 'Expected: 4:45 PM',
      description: 'Ready for transfusion'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'active':
        return 'text-primary bg-primary/10 border-primary/20 animate-pulse';
      case 'pending':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getConnectorColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'active':
        return 'bg-primary';
      default:
        return 'bg-border';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Appointment Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Patient: {appointment?.patientName} • Blood Type: {appointment?.bloodType}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onContactDonor(appointment?.donorId)}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Icon name="Phone" size={16} />
            <span className="hidden sm:inline">Contact</span>
          </button>
          <button
            onClick={() => onViewDetails(appointment?.id)}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            <Icon name="Eye" size={16} />
            <span className="hidden sm:inline">Details</span>
          </button>
        </div>
      </div>
      <div className="relative">
        {timelineStages?.map((stage, index) => (
          <div key={stage?.id} className="flex items-start gap-4 pb-6 last:pb-0">
            {/* Timeline Icon */}
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${getStatusColor(stage?.status)}`}>
              <Icon name={stage?.icon} size={18} />
              
              {/* Connector Line */}
              {index < timelineStages?.length - 1 && (
                <div className={`absolute top-10 left-1/2 w-0.5 h-6 -translate-x-1/2 ${getConnectorColor(stage?.status)}`} />
              )}
            </div>

            {/* Timeline Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-medium ${stage?.status === 'active' ? 'text-primary' : 'text-card-foreground'}`}>
                  {stage?.label}
                </h4>
                <span className={`text-sm font-medium ${stage?.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {stage?.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{stage?.description}</p>
              
              {/* Active Stage Additional Info */}
              {stage?.status === 'active' && (
                <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Icon name="Navigation" size={14} />
                    <span>Live tracking active • Distance: 2.3 km</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Emergency Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-warning/10 text-warning border border-warning/20 rounded-md hover:bg-warning/20 transition-colors">
            <Icon name="AlertTriangle" size={14} />
            <span className="text-sm">Report Delay</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-error/10 text-error border border-error/20 rounded-md hover:bg-error/20 transition-colors">
            <Icon name="UserX" size={14} />
            <span className="text-sm">Activate Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentTimeline;