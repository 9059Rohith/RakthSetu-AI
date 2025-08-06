import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyModePanel = ({ 
  isActive, 
  onActivate, 
  onDeactivate, 
  emergencyStats,
  onBroadcastAlert 
}) => {
  if (!isActive) {
    return (
      <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <div>
              <h3 className="font-semibold text-text-primary">Emergency Mode Available</h3>
              <p className="text-sm text-text-secondary">
                Activate for critical situations to expand search and notify all compatible donors
              </p>
            </div>
          </div>
          <Button
            variant="warning"
            onClick={onActivate}
            iconName="Zap"
            iconPosition="left"
          >
            Activate Emergency
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-error/10 border border-error/30 rounded-lg p-6 mb-6 animate-pulse-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center animate-pulse">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-error">EMERGENCY MODE ACTIVE</h3>
            <p className="text-sm text-text-secondary">
              All compatible donors within expanded radius are being notified
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onDeactivate}
          iconName="X"
          iconPosition="left"
          className="border-error text-error hover:bg-error/10"
        >
          Deactivate
        </Button>
      </div>
      {/* Emergency Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-surface/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-error">{emergencyStats?.expandedRadius}</div>
          <div className="text-xs text-text-secondary">km radius</div>
        </div>
        <div className="bg-surface/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-error">{emergencyStats?.notifiedDonors}</div>
          <div className="text-xs text-text-secondary">donors notified</div>
        </div>
        <div className="bg-surface/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-error">{emergencyStats?.responseTime}</div>
          <div className="text-xs text-text-secondary">avg response</div>
        </div>
        <div className="bg-surface/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-error">{emergencyStats?.availableDonors}</div>
          <div className="text-xs text-text-secondary">available now</div>
        </div>
      </div>
      {/* Emergency Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="destructive"
          onClick={onBroadcastAlert}
          iconName="Megaphone"
          iconPosition="left"
          className="flex-1"
        >
          Broadcast Critical Alert
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/emergency-blood-request-system'}
          iconName="Phone"
          iconPosition="left"
          className="flex-1 border-error text-error hover:bg-error/10"
        >
          Emergency Hotline
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/hospital-administrator-dashboard'}
          iconName="Building2"
          iconPosition="left"
          className="flex-1 border-error text-error hover:bg-error/10"
        >
          Contact Hospital
        </Button>
      </div>
      {/* Emergency Timeline */}
      <div className="mt-4 p-3 bg-surface/30 rounded-lg">
        <h4 className="text-sm font-medium text-text-primary mb-2">Emergency Timeline</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-error rounded-full"></div>
            <span className="text-text-secondary">Emergency activated - {new Date()?.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-text-secondary">Search radius expanded to {emergencyStats?.expandedRadius}km</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-text-secondary">{emergencyStats?.notifiedDonors} donors notified via SMS & push</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModePanel;