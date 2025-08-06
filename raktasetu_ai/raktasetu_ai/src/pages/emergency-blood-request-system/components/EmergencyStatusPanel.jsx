import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyStatusPanel = ({ requestData, onStatusUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState('initiated');
  const [timeline, setTimeline] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock timeline data
    const mockTimeline = [
      {
        id: 1,
        status: 'initiated',
        title: 'Emergency Request Initiated',
        description: 'Critical blood request activated for B+ blood type',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        icon: 'AlertTriangle',
        color: 'red'
      },
      {
        id: 2,
        status: 'searching',
        title: 'Donor Search Active',
        description: 'Notifying 47 compatible donors within 10km radius',
        timestamp: new Date(Date.now() - 240000), // 4 minutes ago
        icon: 'Search',
        color: 'blue'
      },
      {
        id: 3,
        status: 'responses',
        title: 'Donor Responses Received',
        description: '4 donors confirmed availability, 2 en route',
        timestamp: new Date(Date.now() - 180000), // 3 minutes ago
        icon: 'Users',
        color: 'green'
      },
      {
        id: 4,
        status: 'hospital_notified',
        title: 'Hospital Coordination',
        description: 'Apollo Hospital selected and notified',
        timestamp: new Date(Date.now() - 120000), // 2 minutes ago
        icon: 'Building2',
        color: 'green'
      }
    ];

    const mockNotifications = [
      {
        id: 1,
        type: 'donor_confirmed',
        message: 'Rajesh Kumar confirmed - ETA 15 minutes',
        timestamp: new Date(Date.now() - 60000),
        priority: 'high'
      },
      {
        id: 2,
        type: 'hospital_ready',
        message: 'Apollo Hospital prepared for emergency admission',
        timestamp: new Date(Date.now() - 30000),
        priority: 'high'
      }
    ];

    setTimeline(mockTimeline);
    setNotifications(mockNotifications);
    setCurrentStatus('hospital_notified');
  }, []);

  const statusSteps = [
    { key: 'initiated', label: 'Request Initiated', icon: 'AlertTriangle' },
    { key: 'searching', label: 'Finding Donors', icon: 'Search' },
    { key: 'responses', label: 'Donor Responses', icon: 'Users' },
    { key: 'hospital_notified', label: 'Hospital Ready', icon: 'Building2' },
    { key: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  const getCurrentStepIndex = () => {
    return statusSteps?.findIndex(step => step?.key === currentStatus);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'donor_confirmed': return 'UserCheck';
      case 'hospital_ready': return 'Building2';
      case 'emergency_update': return 'AlertTriangle';
      default: return 'Bell';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Progress */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <Icon name="Activity" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Emergency Status</h2>
            <p className="text-sm text-gray-600">Real-time request tracking</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            {statusSteps?.map((step, index) => {
              const isCompleted = index <= getCurrentStepIndex();
              const isCurrent = index === getCurrentStepIndex();

              return (
                <div key={step?.key} className="flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 border-blue-500 text-white animate-pulse' :'bg-gray-200 border-gray-300 text-gray-500'
                    }`}
                  >
                    <Icon name={step?.icon} size={16} />
                  </div>
                  <span className={`text-xs mt-2 text-center ${
                    isCompleted || isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {step?.label}
                  </span>
                  {/* Progress Line */}
                  {index < statusSteps?.length - 1 && (
                    <div
                      className={`absolute top-5 left-full w-full h-0.5 ${
                        index < getCurrentStepIndex() ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      style={{ width: 'calc(100% - 20px)', marginLeft: '10px' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Info" size={16} className="text-blue-600" />
            <span className="font-semibold text-blue-900">Current Status</span>
          </div>
          <p className="text-blue-800">
            {timeline?.find(item => item?.status === currentStatus)?.description || 'Processing your emergency request...'}
          </p>
        </div>
      </div>
      {/* Live Notifications */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <Icon name="Bell" size={16} color="white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Live Updates</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>

        <div className="space-y-3">
          {notifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`border-l-4 p-3 rounded-r-lg ${getPriorityColor(notification?.priority)}`}
            >
              <div className="flex items-center gap-2">
                <Icon name={getNotificationIcon(notification?.type)} size={16} />
                <span className="font-medium text-gray-900">{notification?.message}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {formatTime(notification?.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {notifications?.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
            <p>No new updates</p>
          </div>
        )}
      </div>
      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Icon name="Clock" size={16} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Request Timeline</h3>
        </div>

        <div className="space-y-4">
          {timeline?.map((event, index) => (
            <div key={event.id} className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                event.color === 'red' ? 'bg-red-100 text-red-600' :
                event.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                event.color === 'green'? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <Icon name={event.icon} size={16} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <span className="text-xs text-gray-500">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Emergency Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="destructive" className="w-full">
            <Icon name="Phone" size={16} className="mr-2" />
            Call Emergency Services
          </Button>
          
          <Button variant="outline" className="w-full">
            <Icon name="MessageSquare" size={16} className="mr-2" />
            Contact Family
          </Button>
          
          <Button variant="outline" className="w-full">
            <Icon name="Share2" size={16} className="mr-2" />
            Share Location
          </Button>
          
          <Button variant="outline" className="w-full">
            <Icon name="FileText" size={16} className="mr-2" />
            Medical Records
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyStatusPanel;