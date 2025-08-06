import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceTracker = ({ complianceData, onExportAudit, onViewDetails }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const periods = [
    { value: 'current', label: 'Current Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const getComplianceColor = (percentage) => {
    if (percentage >= 95) return 'text-success';
    if (percentage >= 80) return 'text-warning';
    return 'text-error';
  };

  const getComplianceIcon = (percentage) => {
    if (percentage >= 95) return 'CheckCircle';
    if (percentage >= 80) return 'AlertTriangle';
    return 'XCircle';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'non-compliant': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Compliance Tracker</h2>
            <p className="text-sm text-muted-foreground mt-1">
              DPDP Act & Medical Standards Compliance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground"
            >
              {periods?.map(period => (
                <option key={period?.value} value={period?.value}>
                  {period?.label}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onExportAudit}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export Audit
            </Button>
          </div>
        </div>
      </div>
      {/* Overall Compliance Score */}
      <div className="p-6 border-b border-border">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
            <span className={`text-3xl font-bold ${getComplianceColor(complianceData?.overall?.percentage)}`}>
              {complianceData?.overall?.percentage}%
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Overall Compliance Score</h3>
          <p className="text-sm text-muted-foreground">
            {complianceData?.overall?.status} - Last updated {complianceData?.overall?.lastUpdated}
          </p>
        </div>
      </div>
      {/* Compliance Categories */}
      <div className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Compliance Categories</h3>
        <div className="space-y-4">
          {complianceData?.categories?.map((category) => (
            <div key={category?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon 
                    name={getComplianceIcon(category?.percentage)} 
                    size={20} 
                    className={getComplianceColor(category?.percentage)}
                  />
                  <div>
                    <h4 className="font-medium text-foreground">{category?.name}</h4>
                    <p className="text-sm text-muted-foreground">{category?.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-semibold ${getComplianceColor(category?.percentage)}`}>
                    {category?.percentage}%
                  </span>
                  <p className="text-xs text-muted-foreground">{category?.completedItems}/{category?.totalItems} items</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category?.percentage >= 95 ? 'bg-success' :
                    category?.percentage >= 80 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${category?.percentage}%` }}
                ></div>
              </div>

              {/* Recent Issues */}
              {category?.recentIssues && category?.recentIssues?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Recent Issues:</h5>
                  {category?.recentIssues?.map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Icon name="AlertCircle" size={14} className="text-warning mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{issue}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category?.status)}`}>
                  {category?.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(category?.id)}
                >
                  View Details
                  <Icon name="ArrowRight" size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Audit Trail */}
      <div className="p-6 border-t border-border bg-muted/30">
        <h3 className="font-semibold text-foreground mb-4">Recent Audit Activities</h3>
        <div className="space-y-3">
          {complianceData?.auditTrail?.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                activity?.type === 'compliance' ? 'bg-success' :
                activity?.type === 'warning' ? 'bg-warning' : 'bg-error'
              }`}></div>
              <div className="flex-1">
                <span className="text-foreground">{activity?.action}</span>
                <span className="text-muted-foreground"> by {activity?.user}</span>
              </div>
              <span className="text-xs text-muted-foreground">{activity?.timestamp}</span>
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={() => onViewDetails('audit-trail')}
        >
          <Icon name="History" size={16} className="mr-2" />
          View Full Audit Trail
        </Button>
      </div>
      {/* Upcoming Deadlines */}
      <div className="p-6 border-t border-border">
        <h3 className="font-semibold text-foreground mb-4">Upcoming Compliance Deadlines</h3>
        <div className="space-y-3">
          {complianceData?.upcomingDeadlines?.map((deadline, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-center gap-3">
                <Icon name="Calendar" size={16} className="text-warning" />
                <div>
                  <p className="font-medium text-foreground">{deadline?.task}</p>
                  <p className="text-sm text-muted-foreground">{deadline?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-warning">{deadline?.daysLeft} days left</p>
                <p className="text-xs text-muted-foreground">{deadline?.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceTracker;