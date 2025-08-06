import React from 'react';
import Icon from '../../../components/AppIcon';

const MatchingProgress = ({ isMatching, progress, analysisSteps, emergencyMode = false }) => {
  const steps = [
    { id: 'blood_type', label: 'Blood Type Compatibility', icon: 'Droplets' },
    { id: 'antigens', label: 'Rare Antigen Analysis', icon: 'Zap' },
    { id: 'location', label: 'Geographic Proximity', icon: 'MapPin' },
    { id: 'availability', label: 'Real-time Availability', icon: 'Clock' },
    { id: 'reliability', label: 'Donor Reliability Score', icon: 'Shield' },
    { id: 'traffic', label: 'Traffic & Weather Analysis', icon: 'Navigation' },
    { id: 'optimization', label: 'AI Optimization', icon: 'Brain' }
  ];

  const getStepStatus = (stepId) => {
    if (analysisSteps?.[stepId]?.completed) return 'completed';
    if (analysisSteps?.[stepId]?.active) return 'active';
    return 'pending';
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'active': return 'Loader';
      default: return 'Circle';
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'active': return emergencyMode ? 'text-error' : 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  if (!isMatching) return null;

  return (
    <div className={`bg-surface border rounded-lg p-6 mb-6 ${
      emergencyMode ? 'border-error/30 bg-error/5' : 'border-border'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          emergencyMode ? 'bg-error/10' : 'bg-primary/10'
        }`}>
          <Icon 
            name="Brain" 
            size={20} 
            className={`${emergencyMode ? 'text-error' : 'text-primary'} animate-pulse`} 
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {emergencyMode ? 'Emergency AI Matching' : 'AI-Powered Donor Analysis'}
          </h3>
          <p className="text-sm text-text-secondary">
            Analyzing 30+ variables to find optimal matches
          </p>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Analysis Progress</span>
          <span className="text-sm text-text-secondary">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              emergencyMode ? 'bg-error' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      {/* Analysis Steps */}
      <div className="space-y-3">
        {steps?.map((step) => {
          const status = getStepStatus(step?.id);
          const iconName = getStepIcon(status);
          const colorClass = getStepColor(status);
          
          return (
            <div key={step?.id} className="flex items-center gap-3">
              <Icon 
                name={iconName} 
                size={16} 
                className={`${colorClass} ${status === 'active' ? 'animate-spin' : ''}`}
              />
              <span className={`text-sm ${
                status === 'completed' ? 'text-text-primary font-medium' : 
                status === 'active'? colorClass + ' font-medium' : 'text-text-secondary'
              }`}>
                {step?.label}
              </span>
              {status === 'completed' && (
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded ml-auto">
                  ✓ Complete
                </span>
              )}
              {status === 'active' && (
                <span className={`text-xs px-2 py-1 rounded ml-auto ${
                  emergencyMode ? 'text-error bg-error/10' : 'text-primary bg-primary/10'
                }`}>
                  Processing...
                </span>
              )}
            </div>
          );
        })}
      </div>
      {emergencyMode && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">
              Emergency mode: Expanding search radius and prioritizing all compatible donors
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingProgress;