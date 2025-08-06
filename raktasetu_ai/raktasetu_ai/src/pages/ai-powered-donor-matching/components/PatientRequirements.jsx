import React from 'react';
import Icon from '../../../components/AppIcon';

const PatientRequirements = ({ patient, urgencyLevel, countdownTime, onEmergencyMode }) => {
  const getUrgencyColor = (level) => {
    switch (level) {
      case 'critical': return 'text-error bg-error/10 border-error/20';
      case 'high': return 'text-warning bg-warning/10 border-warning/20';
      case 'medium': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-success bg-success/10 border-success/20';
    }
  };

  const formatCountdown = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours?.toString()?.padStart(2, '0')}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{patient?.name}</h2>
            <p className="text-sm text-text-secondary">Patient ID: {patient?.id}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getUrgencyColor(urgencyLevel)}`}>
          {urgencyLevel?.charAt(0)?.toUpperCase() + urgencyLevel?.slice(1)} Priority
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Droplets" size={18} className="text-error" />
            <span className="text-sm font-medium text-text-secondary">Blood Type Required</span>
          </div>
          <div className="text-xl font-bold text-text-primary">{patient?.bloodType}</div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Zap" size={18} className="text-warning" />
            <span className="text-sm font-medium text-text-secondary">Rare Antigens</span>
          </div>
          <div className="text-sm text-text-primary">
            {patient?.rareAntigens?.length > 0 ? patient?.rareAntigens?.join(', ') : 'None required'}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MapPin" size={18} className="text-accent" />
            <span className="text-sm font-medium text-text-secondary">Location</span>
          </div>
          <div className="text-sm text-text-primary">{patient?.location}</div>
        </div>
      </div>
      {urgencyLevel === 'critical' && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Clock" size={20} className="text-error animate-pulse" />
              <div>
                <p className="text-sm font-medium text-error">Critical Countdown</p>
                <p className="text-xs text-text-secondary">Time until next transfusion needed</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-error font-mono">
                {formatCountdown(countdownTime)}
              </div>
              <button
                onClick={onEmergencyMode}
                className="text-xs text-error hover:underline mt-1"
              >
                Activate Emergency Mode
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <div className="flex items-center gap-1">
          <Icon name="Calendar" size={16} />
          <span>Last Transfusion: {patient?.lastTransfusion}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Activity" size={16} />
          <span>Hemoglobin: {patient?.hemoglobin} g/dL</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Heart" size={16} />
          <span>Thalassemia Major</span>
        </div>
      </div>
    </div>
  );
};

export default PatientRequirements;