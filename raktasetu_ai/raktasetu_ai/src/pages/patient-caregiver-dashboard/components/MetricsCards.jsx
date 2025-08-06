import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCards = ({ metrics }) => {
  const metricItems = [
    {
      id: 'successful_transfusions',
      label: 'Successful Transfusions',
      value: metrics?.successfulTransfusions,
      icon: 'Heart',
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: metrics?.transfusionTrend,
      description: 'This year'
    },
    {
      id: 'average_wait_time',
      label: 'Average Wait Time',
      value: `${metrics?.averageWaitTime}h`,
      icon: 'Clock',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: metrics?.waitTimeTrend,
      description: 'Last 6 months'
    },
    {
      id: 'donor_reliability',
      label: 'Donor Reliability',
      value: `${metrics?.donorReliability}%`,
      icon: 'Shield',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: metrics?.reliabilityTrend,
      description: 'Success rate'
    },
    {
      id: 'next_prediction',
      label: 'Prediction Accuracy',
      value: `${metrics?.predictionAccuracy}%`,
      icon: 'Brain',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: metrics?.accuracyTrend,
      description: 'AI performance'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricItems?.map((metric) => (
        <div key={metric?.id} className="bg-card rounded-xl p-6 border border-border shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg ${metric?.bgColor} flex items-center justify-center`}>
              <Icon name={metric?.icon} size={20} className={metric?.color} />
            </div>
            {metric?.trend !== undefined && (
              <div className={`flex items-center gap-1 ${getTrendColor(metric?.trend)}`}>
                <Icon name={getTrendIcon(metric?.trend)} size={14} />
                <span className="text-xs font-medium">
                  {Math.abs(metric?.trend)}%
                </span>
              </div>
            )}
          </div>

          <div className="mb-2">
            <div className="text-2xl font-bold text-card-foreground mb-1">
              {metric?.value}
            </div>
            <div className="text-sm font-medium text-card-foreground">
              {metric?.label}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {metric?.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;