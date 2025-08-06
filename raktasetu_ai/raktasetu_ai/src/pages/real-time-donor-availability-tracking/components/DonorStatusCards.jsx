import React from 'react';
import Icon from '../../../components/AppIcon';

const DonorStatusCards = ({ donors, onContactDonor, onActivateBackup, onViewProfile }) => {
  const primaryDonor = {
    id: 1,
    name: 'Rajesh Kumar',
    bloodType: 'B+',
    phone: '+91 98765 43210',
    status: 'traveling',
    eta: '15 minutes',
    distance: '2.3 km',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    reliability: 95,
    donations: 12,
    lastDonation: '3 months ago'
  };

  const backupDonors = [
    {
      id: 2,
      name: 'Priya Sharma',
      bloodType: 'B+',
      phone: '+91 98765 43211',
      status: 'confirmed',
      eta: '25 minutes',
      distance: '4.1 km',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      reliability: 88,
      donations: 8
    },
    {
      id: 3,
      name: 'Arjun Patel',
      bloodType: 'B+',
      phone: '+91 98765 43212',
      status: 'standby',
      eta: '30 minutes',
      distance: '5.8 km',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      reliability: 92,
      donations: 15
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'traveling':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'standby':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'traveling':
        return 'Car';
      case 'confirmed':
        return 'CheckCircle';
      case 'standby':
        return 'Clock';
      default:
        return 'User';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'traveling':
        return 'En Route';
      case 'confirmed':
        return 'Confirmed';
      case 'standby':
        return 'On Standby';
      default:
        return 'Unknown';
    }
  };

  const DonorCard = ({ donor, isPrimary = false, onActivate }) => (
    <div className={`bg-card rounded-lg border p-4 ${isPrimary ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={donor?.avatar}
              alt={donor?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card flex items-center justify-center ${getStatusColor(donor?.status)}`}>
              <Icon name={getStatusIcon(donor?.status)} size={10} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{donor?.name}</h3>
            <p className="text-sm text-muted-foreground">{donor?.bloodType} Donor</p>
          </div>
        </div>
        {isPrimary && (
          <div className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded">
            PRIMARY
          </div>
        )}
      </div>

      {/* Status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${getStatusColor(donor?.status)}`}>
        <Icon name={getStatusIcon(donor?.status)} size={16} />
        <span className="font-medium">{getStatusLabel(donor?.status)}</span>
        <div className="ml-auto text-sm">
          ETA: {donor?.eta}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Distance:</span>
          <span className="font-medium text-card-foreground">{donor?.distance}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Reliability:</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full transition-all duration-300"
                style={{ width: `${donor?.reliability}%` }}
              />
            </div>
            <span className="font-medium text-card-foreground">{donor?.reliability}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Donations:</span>
          <span className="font-medium text-card-foreground">{donor?.donations}</span>
        </div>
        {donor?.lastDonation && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Donation:</span>
            <span className="font-medium text-card-foreground">{donor?.lastDonation}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onContactDonor(donor?.id, 'call')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Icon name="Phone" size={16} />
          <span>Call</span>
        </button>
        <button
          onClick={() => onContactDonor(donor?.id, 'message')}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          <Icon name="MessageCircle" size={16} />
          <span>Message</span>
        </button>
        <button
          onClick={() => onViewProfile(donor?.id)}
          className="px-3 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
        >
          <Icon name="User" size={16} />
        </button>
      </div>

      {/* Backup Activation */}
      {!isPrimary && onActivate && (
        <button
          onClick={() => onActivate(donor?.id)}
          className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-warning/10 text-warning border border-warning/20 rounded-md hover:bg-warning/20 transition-colors"
        >
          <Icon name="UserCheck" size={16} />
          <span>Activate as Primary</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Primary Donor */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Primary Donor</h3>
        <DonorCard donor={primaryDonor} isPrimary={true} />
      </div>
      {/* Backup Donors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Backup Donors</h3>
          <button
            onClick={() => onActivateBackup('expand')}
            className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
          >
            <Icon name="Search" size={16} />
            <span>Expand Search</span>
          </button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {backupDonors?.map((donor) => (
            <DonorCard 
              key={donor?.id} 
              donor={donor} 
              onActivate={onActivateBackup}
            />
          ))}
        </div>
      </div>
      {/* Emergency Actions */}
      <div className="bg-error/5 border border-error/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="AlertTriangle" size={20} className="text-error" />
          <h4 className="font-semibold text-error">Emergency Actions</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Use these options if primary donor becomes unavailable or delays occur.
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-error text-error-foreground rounded-md hover:bg-error/90 transition-colors">
            <Icon name="Users" size={16} />
            <span>Activate All Backups</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-warning text-warning-foreground rounded-md hover:bg-warning/90 transition-colors">
            <Icon name="MapPin" size={16} />
            <span>Expand Radius</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
            <Icon name="Phone" size={16} />
            <span>Contact Hospital</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorStatusCards;