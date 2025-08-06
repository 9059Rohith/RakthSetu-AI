import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HospitalCoordination = ({ patientLocation, bloodType, onHospitalSelect }) => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock hospital data with blood bank inventory
    const mockHospitals = [
      {
        id: 'H001',
        name: 'Apollo Hospital',
        address: 'Saibaba Colony, Coimbatore',
        distance: '2.1 km',
        eta: '8 mins',
        bloodBankStatus: 'available',
        inventory: {
          'B+': 12,
          'B-': 3,
          'O+': 8,
          'O-': 2,
          'A+': 15,
          'A-': 4,
          'AB+': 6,
          'AB-': 1
        },
        emergencyContact: '+91 422 4444444',
        rating: 4.8,
        specialties: ['Hematology', 'Emergency Care', 'Blood Bank'],
        coordinates: '11.0168, 76.9558'
      },
      {
        id: 'H002',
        name: 'KMCH Hospital',
        address: 'Avanashi Road, Coimbatore',
        distance: '3.7 km',
        eta: '12 mins',
        bloodBankStatus: 'limited',
        inventory: {
          'B+': 4,
          'B-': 1,
          'O+': 6,
          'O-': 0,
          'A+': 8,
          'A-': 2,
          'AB+': 3,
          'AB-': 0
        },
        emergencyContact: '+91 422 2222222',
        rating: 4.6,
        specialties: ['Cardiology', 'Emergency Care', 'Blood Bank'],
        coordinates: '11.0041, 76.9597'
      },
      {
        id: 'H003',
        name: 'PSG Hospitals',
        address: 'Peelamedu, Coimbatore',
        distance: '5.2 km',
        eta: '18 mins',
        bloodBankStatus: 'critical',
        inventory: {
          'B+': 1,
          'B-': 0,
          'O+': 2,
          'O-': 0,
          'A+': 3,
          'A-': 1,
          'AB+': 1,
          'AB-': 0
        },
        emergencyContact: '+91 422 3333333',
        rating: 4.5,
        specialties: ['Multi-specialty', 'Emergency Care'],
        coordinates: '11.0255, 76.9366'
      }
    ];

    const timer = setTimeout(() => {
      setHospitals(mockHospitals);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [patientLocation]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'CheckCircle';
      case 'limited': return 'AlertTriangle';
      case 'critical': return 'AlertCircle';
      default: return 'HelpCircle';
    }
  };

  const getInventoryStatus = (hospital, bloodType) => {
    const count = hospital?.inventory?.[bloodType] || 0;
    if (count >= 5) return { status: 'good', color: 'text-green-600' };
    if (count >= 2) return { status: 'limited', color: 'text-yellow-600' };
    return { status: 'critical', color: 'text-red-600' };
  };

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    onHospitalSelect(hospital);
  };

  const openDirections = (coordinates) => {
    const [lat, lng] = coordinates?.split(', ');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Icon name="Building2" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hospital Coordination</h2>
            <p className="text-sm text-gray-600">Finding nearby hospitals with blood banks...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3]?.map((i) => (
            <div key={i} className="animate-pulse">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Icon name="Building2" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hospital Coordination</h2>
          <p className="text-sm text-gray-600">{hospitals?.length} hospitals with blood banks nearby</p>
        </div>
      </div>
      <div className="space-y-4">
        {hospitals?.map((hospital) => {
          const inventoryStatus = getInventoryStatus(hospital, bloodType);
          const isSelected = selectedHospital?.id === hospital?.id;

          return (
            <div
              key={hospital?.id}
              className={`border rounded-lg p-4 transition-all ${
                isSelected 
                  ? 'border-green-500 bg-green-50' :'border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Building2" size={24} className="text-blue-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{hospital?.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hospital?.bloodBankStatus)}`}>
                      <Icon name={getStatusIcon(hospital?.bloodBankStatus)} size={12} className="inline mr-1" />
                      {hospital?.bloodBankStatus?.toUpperCase()}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        SELECTED
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{hospital?.address}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      <span>{hospital?.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      <span>ETA: {hospital?.eta}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={14} />
                      <span>{hospital?.rating}/5</span>
                    </div>
                  </div>

                  {/* Blood Inventory */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Blood Bank Inventory</span>
                      <span className={`text-sm font-semibold ${inventoryStatus?.color}`}>
                        {bloodType}: {hospital?.inventory?.[bloodType]} units
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {Object.entries(hospital?.inventory)?.map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span className="text-gray-600">{type}:</span>
                          <span className={count > 0 ? 'text-gray-900' : 'text-red-500'}>
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hospital?.specialties?.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant={isSelected ? "success" : "default"}
                    size="sm"
                    onClick={() => handleHospitalSelect(hospital)}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${hospital?.emergencyContact}`)}
                  >
                    <Icon name="Phone" size={16} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDirections(hospital?.coordinates)}
                  >
                    <Icon name="Navigation" size={16} />
                  </Button>
                </div>
              </div>
              {/* Quick Actions for Selected Hospital */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Hospital notified - Preparing for emergency admission
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Icon name="MessageSquare" size={16} className="mr-2" />
                      Chat with Staff
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Icon name="FileText" size={16} className="mr-2" />
                      Send Records
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {hospitals?.length === 0 && !loading && (
        <div className="text-center py-8">
          <Icon name="Building2" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hospitals found</h3>
          <p className="text-gray-600">Expanding search radius to find more options...</p>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>All hospitals have been notified of emergency request</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time inventory</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalCoordination;