import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DonorMatchCard = ({ donor, onContact, onViewProfile }) => {
  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getDistanceColor = (distance) => {
    if (distance <= 5) return 'text-success';
    if (distance <= 15) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Current Match</h3>
        <div className="flex items-center gap-1">
          <Icon name="Zap" size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary">AI Matched</span>
        </div>
      </div>
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Image
            src={donor?.avatar}
            alt={donor?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card flex items-center justify-center">
            <Icon name="Check" size={12} color="white" />
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-card-foreground mb-1">{donor?.name}</h4>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Icon name="Droplets" size={14} />
              <span>{donor?.bloodType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="MapPin" size={14} />
              <span>{donor?.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Star" size={14} className="text-warning" />
            <span className="text-sm font-medium">{donor?.rating}</span>
            <span className="text-sm text-muted-foreground">({donor?.totalDonations} donations)</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Compatibility</span>
            <Icon name="Target" size={14} className={getCompatibilityColor(donor?.compatibilityScore)} />
          </div>
          <div className={`text-lg font-bold ${getCompatibilityColor(donor?.compatibilityScore)}`}>
            {donor?.compatibilityScore}%
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Distance</span>
            <Icon name="Navigation" size={14} className={getDistanceColor(donor?.distance)} />
          </div>
          <div className={`text-lg font-bold ${getDistanceColor(donor?.distance)}`}>
            {donor?.distance} km
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Clock" size={14} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Available: {donor?.availableTime}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          iconName="User"
          iconPosition="left"
          onClick={() => onViewProfile(donor?.id)}
        >
          View Profile
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          iconName="Phone"
          iconPosition="left"
          onClick={() => onContact(donor?.id)}
        >
          Contact
        </Button>
      </div>
    </div>
  );
};

export default DonorMatchCard;