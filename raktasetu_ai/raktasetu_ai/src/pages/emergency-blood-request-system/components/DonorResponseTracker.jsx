import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DonorResponseTracker = ({ requestId, onDonorSelect }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock real-time donor responses
  useEffect(() => {
    const mockResponses = [
      {
        id: 'D001',
        name: 'Rajesh Kumar',
        bloodType: 'B+',
        distance: '2.3 km',
        eta: '15 mins',
        status: 'confirmed',
        reliability: 95,
        lastDonation: '3 months ago',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'D002',
        name: 'Priya Sharma',
        bloodType: 'B+',
        distance: '3.1 km',
        eta: '20 mins',
        status: 'en_route',
        reliability: 88,
        lastDonation: '2 months ago',
        phone: '+91 87654 32109',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'D003',
        name: 'Arun Patel',
        bloodType: 'B+',
        distance: '4.7 km',
        eta: '25 mins',
        status: 'responding',
        reliability: 92,
        lastDonation: '1 month ago',
        phone: '+91 76543 21098',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'D004',
        name: 'Meera Reddy',
        bloodType: 'B+',
        distance: '5.2 km',
        eta: '30 mins',
        status: 'pending',
        reliability: 85,
        lastDonation: '4 months ago',
        phone: '+91 65432 10987',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    ];

    // Simulate real-time updates
    const timer = setTimeout(() => {
      setResponses(mockResponses);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [requestId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'en_route': return 'bg-blue-100 text-blue-800';
      case 'responding': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return 'CheckCircle';
      case 'en_route': return 'Navigation';
      case 'responding': return 'Clock';
      case 'pending': return 'AlertCircle';
      default: return 'AlertCircle';
    }
  };

  const getReliabilityColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Icon name="Users" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Donor Response Tracking</h2>
            <p className="text-sm text-gray-600">Searching for compatible donors...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3]?.map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Icon name="Users" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Donor Response Tracking</h2>
            <p className="text-sm text-gray-600">{responses?.length} donors found in your area</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Updates</span>
        </div>
      </div>
      <div className="space-y-4">
        {responses?.map((donor) => (
          <div
            key={donor?.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={donor?.avatar}
                  alt={donor?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{donor?.name}</h3>
                  <span className="text-sm font-medium text-red-600">{donor?.bloodType}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donor?.status)}`}>
                    <Icon name={getStatusIcon(donor?.status)} size={12} className="inline mr-1" />
                    {donor?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" size={14} />
                    <span>{donor?.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    <span>ETA: {donor?.eta}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} />
                    <span className={getReliabilityColor(donor?.reliability)}>
                      {donor?.reliability}% reliable
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} />
                    <span>Last: {donor?.lastDonation}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${donor?.phone}`)}
                >
                  <Icon name="Phone" size={16} />
                </Button>
                
                <Button
                  variant={donor?.status === 'confirmed' ? 'success' : 'default'}
                  size="sm"
                  onClick={() => onDonorSelect(donor)}
                  disabled={donor?.status === 'pending'}
                >
                  {donor?.status === 'confirmed' ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>

            {/* Progress indicator for en_route donors */}
            {donor?.status === 'en_route' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>En route to hospital</span>
                  <span>{donor?.eta}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {responses?.length === 0 && !loading && (
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No responses yet</h3>
          <p className="text-gray-600">We're actively searching for compatible donors in your area.</p>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Search radius: 10 km (expanding automatically)</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span>Searching...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorResponseTracker;