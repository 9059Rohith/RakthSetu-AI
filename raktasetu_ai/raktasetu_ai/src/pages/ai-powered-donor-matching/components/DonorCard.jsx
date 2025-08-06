import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DonorCard = ({ donor, onContact, onViewProfile, emergencyMode = false }) => {
  const getCompatibilityColor = (score) => {
    if (score >= 95) return 'text-success bg-success/10';
    if (score >= 85) return 'text-accent bg-accent/10';
    if (score >= 70) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getAvailabilityStatus = (status) => {
    switch (status) {
      case 'available': return { color: 'text-success', bg: 'bg-success', label: 'Available Now' };
      case 'busy': return { color: 'text-warning', bg: 'bg-warning', label: 'Busy' };
      case 'unavailable': return { color: 'text-error', bg: 'bg-error', label: 'Unavailable' };
      default: return { color: 'text-text-secondary', bg: 'bg-text-secondary', label: 'Unknown' };
    }
  };

  const availability = getAvailabilityStatus(donor?.availabilityStatus);

  return (
    <div className={`bg-surface border rounded-lg p-4 transition-all duration-200 hover:shadow-medium ${
      emergencyMode ? 'border-error/30 bg-error/5' : 'border-border hover:border-primary/30'
    } ${donor?.isPriority ? 'ring-2 ring-primary/20' : ''}`}>
      {/* Priority Badge */}
      {donor?.isPriority && (
        <div className="flex items-center gap-1 mb-3">
          <Icon name="Star" size={16} className="text-primary fill-current" />
          <span className="text-xs font-medium text-primary">Priority Donor</span>
        </div>
      )}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <Image
            src={donor?.profilePhoto}
            alt={donor?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${availability?.bg} rounded-full border-2 border-surface`}></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-text-primary truncate">{donor?.name}</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={12}
                  className={i < donor?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}
                />
              ))}
              <span className="text-xs text-text-secondary ml-1">({donor?.totalDonations})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${availability?.color} ${availability?.bg}/10`}>
              {availability?.label}
            </span>
            <span className="px-2 py-1 bg-error/10 text-error rounded text-xs font-bold">
              {donor?.bloodType}
            </span>
          </div>
        </div>

        <div className={`text-right px-3 py-1 rounded-lg ${getCompatibilityColor(donor?.compatibilityScore)}`}>
          <div className="text-lg font-bold">{donor?.compatibilityScore}%</div>
          <div className="text-xs opacity-80">Match</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Icon name="MapPin" size={14} className="text-text-secondary" />
          <span className="text-text-secondary">{donor?.distance} km away</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Clock" size={14} className="text-text-secondary" />
          <span className="text-text-secondary">{donor?.travelTime} mins</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Calendar" size={14} className="text-text-secondary" />
          <span className="text-text-secondary">Last: {donor?.lastDonation}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Shield" size={14} className="text-text-secondary" />
          <span className="text-text-secondary">{donor?.reliabilityScore}% reliable</span>
        </div>
      </div>
      {donor?.rareAntigens && donor?.rareAntigens?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-text-secondary mb-1">Rare Antigens:</p>
          <div className="flex flex-wrap gap-1">
            {donor?.rareAntigens?.map((antigen) => (
              <span key={antigen} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                {antigen}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          iconName="Phone"
          iconPosition="left"
          onClick={() => onContact(donor?.id, 'call')}
        >
          Call
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          iconName="MessageCircle"
          iconPosition="left"
          onClick={() => onContact(donor?.id, 'message')}
        >
          Message
        </Button>
        <Button
          variant={emergencyMode ? "destructive" : "default"}
          size="sm"
          className="flex-1"
          onClick={() => onViewProfile(donor?.id)}
        >
          {emergencyMode ? 'Request Now' : 'View Profile'}
        </Button>
      </div>
      {emergencyMode && (
        <div className="mt-3 p-2 bg-error/10 rounded text-center">
          <p className="text-xs text-error font-medium">Emergency Mode Active</p>
        </div>
      )}
    </div>
  );
};

export default DonorCard;