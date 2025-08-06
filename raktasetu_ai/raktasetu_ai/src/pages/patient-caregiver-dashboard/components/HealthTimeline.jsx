import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const HealthTimeline = ({ timelineData, onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('3months');

  const periods = [
    { value: '1month', label: '1M' },
    { value: '3months', label: '3M' },
    { value: '6months', label: '6M' },
    { value: '1year', label: '1Y' }
  ];

  const getEventIcon = (type) => {
    switch (type) {
      case 'transfusion':
        return 'Droplets';
      case 'prediction':
        return 'Brain';
      case 'appointment':
        return 'Calendar';
      case 'emergency':
        return 'AlertTriangle';
      default:
        return 'Circle';
    }
  };

  const getEventColor = (type, status) => {
    if (type === 'emergency') return 'text-error';
    if (type === 'prediction') return 'text-primary';
    if (status === 'completed') return 'text-success';
    if (status === 'upcoming') return 'text-warning';
    return 'text-muted-foreground';
  };

  const getEventBgColor = (type, status) => {
    if (type === 'emergency') return 'bg-error/10';
    if (type === 'prediction') return 'bg-primary/10';
    if (status === 'completed') return 'bg-success/10';
    if (status === 'upcoming') return 'bg-warning/10';
    return 'bg-muted';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Health Timeline</h3>
        <div className="flex bg-muted rounded-lg p-1">
          {periods?.map((period) => (
            <button
              key={period?.value}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === period?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSelectedPeriod(period?.value)}
            >
              {period?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {timelineData?.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${getEventBgColor(event.type, event.status)} flex items-center justify-center`}>
                <Icon 
                  name={getEventIcon(event.type)} 
                  size={16} 
                  className={getEventColor(event.type, event.status)}
                />
              </div>
              {index < timelineData?.length - 1 && (
                <div className="w-px h-8 bg-border mt-2"></div>
              )}
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-card-foreground">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {event.date}
                </span>
              </div>

              {event.details && (
                <div className="bg-muted rounded-lg p-3 mt-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {event.details?.hemoglobin && (
                      <div>
                        <span className="text-muted-foreground">Hemoglobin:</span>
                        <span className="font-medium ml-1">{event.details?.hemoglobin}</span>
                      </div>
                    )}
                    {event.details?.unitsTransfused && (
                      <div>
                        <span className="text-muted-foreground">Units:</span>
                        <span className="font-medium ml-1">{event.details?.unitsTransfused}</span>
                      </div>
                    )}
                    {event.details?.donor && (
                      <div>
                        <span className="text-muted-foreground">Donor:</span>
                        <span className="font-medium ml-1">{event.details?.donor}</span>
                      </div>
                    )}
                    {event.details?.hospital && (
                      <div>
                        <span className="text-muted-foreground">Hospital:</span>
                        <span className="font-medium ml-1">{event.details?.hospital}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {event.actions && (
                <div className="flex gap-2 mt-3">
                  {event.actions?.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                      onClick={() => onNavigate(action?.path)}
                    >
                      {action?.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button
          className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors"
          onClick={() => onNavigate('/health-timeline')}
        >
          View Complete Timeline
        </button>
      </div>
    </div>
  );
};

export default HealthTimeline;