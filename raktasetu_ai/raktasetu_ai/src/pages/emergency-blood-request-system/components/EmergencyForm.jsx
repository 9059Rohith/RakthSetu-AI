import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EmergencyForm = ({ onSubmit, patientData, isSubmitting }) => {
  const [formData, setFormData] = useState({
    patientId: patientData?.id || '',
    bloodType: patientData?.bloodType || '',
    rareAntigens: patientData?.rareAntigens || [],
    urgencyLevel: 'critical',
    unitsRequired: '2',
    location: '',
    additionalNotes: '',
    contactNumber: patientData?.emergencyContact || ''
  });

  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    // Auto-populate current location
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`
          }));
          setLocationLoading(false);
        },
        () => {
          setLocationLoading(false);
        }
      );
    }
  }, []);

  const urgencyOptions = [
    { 
      value: 'critical', 
      label: 'Critical - 2 Hours',
      description: 'Life-threatening emergency'
    },
    { 
      value: 'urgent', 
      label: 'Urgent - 6 Hours',
      description: 'Immediate medical attention required'
    },
    { 
      value: 'high', 
      label: 'High Priority - 12 Hours',
      description: 'Scheduled emergency procedure'
    }
  ];

  const unitsOptions = [
    { value: '1', label: '1 Unit' },
    { value: '2', label: '2 Units' },
    { value: '3', label: '3 Units' },
    { value: '4', label: '4 Units' },
    { value: '5+', label: '5+ Units' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit(formData);
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'urgent': return 'text-orange-600 bg-orange-50';
      case 'high': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
          <Icon name="AlertTriangle" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Emergency Blood Request</h2>
          <p className="text-sm text-gray-600">Critical blood sourcing with priority matching</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon name="User" size={16} />
            Patient Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Patient ID"
              value={formData?.patientId}
              onChange={(e) => handleInputChange('patientId', e?.target?.value)}
              placeholder="Enter patient ID"
              required
            />
            
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <Icon name="Droplets" size={16} className="text-red-600" />
                  <span className="font-bold text-red-700 text-lg">
                    {formData?.bloodType || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {formData?.rareAntigens?.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rare Antigens Required
              </label>
              <div className="flex flex-wrap gap-2">
                {formData?.rareAntigens?.map((antigen, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
                  >
                    {antigen}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Emergency Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Urgency Level"
            options={urgencyOptions}
            value={formData?.urgencyLevel}
            onChange={(value) => handleInputChange('urgencyLevel', value)}
            required
          />

          <Select
            label="Units Required"
            options={unitsOptions}
            value={formData?.unitsRequired}
            onChange={(value) => handleInputChange('unitsRequired', value)}
            required
          />
        </div>

        {/* Urgency Indicator */}
        <div className={`p-4 rounded-lg ${getUrgencyColor(formData?.urgencyLevel)}`}>
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={16} />
            <span className="font-semibold">
              {urgencyOptions?.find(opt => opt?.value === formData?.urgencyLevel)?.label}
            </span>
          </div>
          <p className="text-sm mt-1">
            {urgencyOptions?.find(opt => opt?.value === formData?.urgencyLevel)?.description}
          </p>
        </div>

        {/* Location */}
        <div>
          <Input
            label="Current Location"
            value={formData?.location}
            onChange={(e) => handleInputChange('location', e?.target?.value)}
            placeholder={locationLoading ? "Getting location..." : "Enter current location or coordinates"}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Location helps us find the nearest compatible donors
          </p>
        </div>

        {/* Contact Information */}
        <Input
          label="Emergency Contact Number"
          type="tel"
          value={formData?.contactNumber}
          onChange={(e) => handleInputChange('contactNumber', e?.target?.value)}
          placeholder="Enter emergency contact number"
          required
        />

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Medical Notes
          </label>
          <textarea
            value={formData?.additionalNotes}
            onChange={(e) => handleInputChange('additionalNotes', e?.target?.value)}
            placeholder="Any specific medical conditions, allergies, or special requirements..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="destructive"
            loading={isSubmitting}
            className="w-full h-12 text-lg font-semibold"
          >
            <Icon name="Zap" size={20} className="mr-2" />
            Activate Emergency Request
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            This will immediately notify all compatible donors in your area
          </p>
        </div>
      </form>
    </div>
  );
};

export default EmergencyForm;