import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryChart = ({ inventoryData, expirationData, usageData, onExportData }) => {
  const [activeChart, setActiveChart] = useState('inventory');

  const chartTypes = [
    { id: 'inventory', label: 'Current Stock', icon: 'BarChart3' },
    { id: 'expiration', label: 'Expiration Timeline', icon: 'TrendingDown' },
    { id: 'usage', label: 'Usage Patterns', icon: 'Activity' }
  ];

  const bloodTypeColors = {
    'A+': '#ef4444', 'A-': '#f97316', 'B+': '#eab308', 'B-': '#84cc16',
    'AB+': '#22c55e', 'AB-': '#06b6d4', 'O+': '#3b82f6', 'O-': '#8b5cf6'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
              <span className="font-medium text-popover-foreground">{entry?.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderInventoryChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={inventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="bloodType" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="current" 
          fill="var(--color-primary)" 
          radius={[4, 4, 0, 0]}
          name="Current Stock"
        />
        <Bar 
          dataKey="minimum" 
          fill="var(--color-warning)" 
          radius={[4, 4, 0, 0]}
          name="Minimum Required"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderExpirationChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={expirationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="expiring" 
          stroke="var(--color-error)" 
          strokeWidth={2}
          dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
          name="Units Expiring"
        />
        <Line 
          type="monotone" 
          dataKey="critical" 
          stroke="var(--color-warning)" 
          strokeWidth={2}
          dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
          name="Critical (≤3 days)"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderUsageChart = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Weekly Usage Trend</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={usageData?.weekly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="used" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              name="Units Used"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-4">Blood Type Distribution</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={usageData?.distribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="percentage"
            >
              {usageData?.distribution?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={bloodTypeColors?.[entry?.bloodType]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [`${value}%`, props?.payload?.bloodType]}
              labelFormatter={() => ''}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {usageData?.distribution?.map((entry) => (
            <div key={entry?.bloodType} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: bloodTypeColors?.[entry?.bloodType] }}
              ></div>
              <span className="text-muted-foreground">{entry?.bloodType}:</span>
              <span className="font-medium text-foreground">{entry?.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChart = () => {
    switch (activeChart) {
      case 'inventory': return renderInventoryChart();
      case 'expiration': return renderExpirationChart();
      case 'usage': return renderUsageChart();
      default: return renderInventoryChart();
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">Inventory Analytics</h2>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportData}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
            >
              <Icon name="RefreshCw" size={16} />
            </Button>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex flex-wrap gap-2 mt-4">
          {chartTypes?.map((type) => (
            <button
              key={type?.id}
              onClick={() => setActiveChart(type?.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeChart === type?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={type?.icon} size={16} />
              {type?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Chart Content */}
      <div className="p-6">
        {renderChart()}
      </div>
      {/* AI Insights */}
      <div className="p-6 border-t border-border bg-muted/30">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Icon name="Brain" size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-2">AI Recommendations</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• O- blood type is running critically low. Consider emergency procurement.</p>
              <p>• 15 units of A+ blood will expire within 3 days. Schedule urgent usage.</p>
              <p>• Peak usage detected on Mondays and Fridays. Adjust procurement schedule.</p>
              <p>• Predicted shortage of B- blood type in next 7 days based on usage patterns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryChart;