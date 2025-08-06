import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AvailabilityPreferencesSection = ({ formData, onUpdate, onNext, onPrevious }) => {
  const [selectedDays, setSelectedDays] = useState(formData?.availableDays || []);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState(formData?.timeSlots || []);
  const [showMap, setShowMap] = useState(false);

  const daysOfWeek = [
    { value: 'monday', label: 'Monday', short: 'Mon' },
    { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { value: 'thursday', label: 'Thursday', short: 'Thu' },
    { value: 'friday', label: 'Friday', short: 'Fri' },
    { value: 'saturday', label: 'Saturday', short: 'Sat' },
    { value: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  const timeSlots = [
    { value: 'early_morning', label: 'Early Morning (6:00 - 9:00 AM)', icon: 'Sunrise' },
    { value: 'morning', label: 'Morning (9:00 AM - 12:00 PM)', icon: 'Sun' },
    { value: 'afternoon', label: 'Afternoon (12:00 - 4:00 PM)', icon: 'Sun' },
    { value: 'evening', label: 'Evening (4:00 - 8:00 PM)', icon: 'Sunset' },
    { value: 'night', label: 'Night (8:00 PM - 10:00 PM)', icon: 'Moon' }
  ];

  const locationTypes = [
    { value: 'hospital', label: 'Hospitals', description: 'Government and private hospitals' },
    { value: 'blood_bank', label: 'Blood Banks', description: 'Dedicated blood collection centers' },
    { value: 'mobile_unit', label: 'Mobile Units', description: 'Mobile blood donation camps' },
    { value: 'workplace', label: 'Workplace', description: 'Corporate donation drives' },
    { value: 'college', label: 'Educational Institutions', description: 'College and university camps' }
  ];

  const travelRadiusOptions = [
    { value: '5', label: '5 km - Very Local' },
    { value: '10', label: '10 km - Local Area' },
    { value: '25', label: '25 km - City Wide' },
    { value: '50', label: '50 km - Regional' },
    { value: '100', label: '100 km - State Wide' }
  ];

  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleDayToggle = (day) => {
    const updated = selectedDays?.includes(day)
      ? selectedDays?.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updated);
    onUpdate({ availableDays: updated });
  };

  const handleTimeSlotToggle = (slot) => {
    const updated = selectedTimeSlots?.includes(slot)
      ? selectedTimeSlots?.filter(s => s !== slot)
      : [...selectedTimeSlots, slot];
    setSelectedTimeSlots(updated);
    onUpdate({ timeSlots: updated });
  };

  const handleLocationTypeToggle = (locationType) => {
    const current = formData?.preferredLocationTypes || [];
    const updated = current?.includes(locationType)
      ? current?.filter(type => type !== locationType)
      : [...current, locationType];
    onUpdate({ preferredLocationTypes: updated });
  };

  const isFormValid = () => {
    return selectedDays?.length > 0 && selectedTimeSlots?.length > 0 && formData?.travelRadius;
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Calendar" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Availability Preferences</h2>
          <p className="text-sm text-text-secondary">Set your donation schedule and location preferences</p>
        </div>
      </div>
      <div className="space-y-8">
        {/* Days of Week Selection */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Available Days</h3>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek?.map((day) => (
              <button
                key={day?.value}
                onClick={() => handleDayToggle(day?.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedDays?.includes(day?.value)
                    ? 'border-primary bg-primary text-white' :'border-border bg-surface text-text-primary hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs font-medium">{day?.short}</div>
                  <div className="text-xs opacity-80 mt-1">{day?.label?.slice(0, 3)}</div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Select the days when you're typically available for donation
          </p>
        </div>

        {/* Time Slots Selection */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Preferred Time Slots</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {timeSlots?.map((slot) => (
              <button
                key={slot?.value}
                onClick={() => handleTimeSlotToggle(slot?.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedTimeSlots?.includes(slot?.value)
                    ? 'border-primary bg-primary/5 text-primary' :'border-border bg-surface text-text-primary hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    name={slot?.icon} 
                    size={20} 
                    className={selectedTimeSlots?.includes(slot?.value) ? 'text-primary' : 'text-text-secondary'}
                  />
                  <div>
                    <div className="text-sm font-medium">{slot?.label?.split(' (')?.[0]}</div>
                    <div className="text-xs opacity-70">{slot?.label?.split(' (')?.[1]?.replace(')', '')}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Travel Radius */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Select
              label="Maximum Travel Distance"
              options={travelRadiusOptions}
              value={formData?.travelRadius || ''}
              onChange={(value) => handleInputChange('travelRadius', value)}
              placeholder="Select travel radius"
              description="How far are you willing to travel for donation?"
              required
            />
          </div>

          <div>
            <Input
              label="Preferred Location/Area"
              type="text"
              placeholder="e.g., Coimbatore City, RS Puram"
              value={formData?.preferredArea || ''}
              onChange={(e) => handleInputChange('preferredArea', e?.target?.value)}
              description="Specific area or landmark you prefer"
            />
          </div>
        </div>

        {/* Location Types */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Preferred Donation Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locationTypes?.map((location) => (
              <label
                key={location.value}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData?.preferredLocationTypes?.includes(location.value)
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-1"
                  checked={formData?.preferredLocationTypes?.includes(location.value) || false}
                  onChange={() => handleLocationTypeToggle(location.value)}
                />
                <div>
                  <div className="text-sm font-medium text-text-primary">{location.label}</div>
                  <div className="text-xs text-text-secondary mt-1">{location.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Map Visualization */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Location Visualization</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              <Icon name="Map" size={16} className="mr-2" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>

          {showMap && (
            <div className="h-64 bg-muted rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Coimbatore Blood Donation Centers"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=11.0168,76.9558&z=12&output=embed"
                className="border-0"
              />
            </div>
          )}
        </div>

        {/* Emergency Availability */}
        <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-error mb-2">Emergency Availability</h4>
              <p className="text-xs text-text-secondary mb-3">
                Can you be contacted for emergency blood requests outside your regular availability?
              </p>
              <div className="flex gap-4">
                <Checkbox
                  label="Yes, contact me for emergencies"
                  checked={formData?.emergencyAvailable || false}
                  onChange={(e) => handleInputChange('emergencyAvailable', e?.target?.checked)}
                />
              </div>
              {formData?.emergencyAvailable && (
                <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-xs text-text-secondary">
                    You'll receive priority notifications for critical blood shortages matching your blood type.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Frequency Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Preferred Donation Frequency
            </label>
            <div className="space-y-2">
              {[
                { value: 'monthly', label: 'Monthly (12 times/year)', desc: 'Regular contributor' },
                { value: 'quarterly', label: 'Quarterly (4 times/year)', desc: 'Seasonal donor' },
                { value: 'biannual', label: 'Twice a year', desc: 'Occasional donor' },
                { value: 'annual', label: 'Once a year', desc: 'Annual donor' }
              ]?.map((freq) => (
                <label key={freq?.value} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer">
                  <input
                    type="radio"
                    name="donationFrequency"
                    value={freq?.value}
                    checked={formData?.donationFrequency === freq?.value}
                    onChange={(e) => handleInputChange('donationFrequency', e?.target?.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <div>
                    <div className="text-sm font-medium text-text-primary">{freq?.label}</div>
                    <div className="text-xs text-text-secondary">{freq?.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Input
              label="Additional Notes"
              type="text"
              placeholder="Any specific preferences or constraints?"
              value={formData?.availabilityNotes || ''}
              onChange={(e) => handleInputChange('availabilityNotes', e?.target?.value)}
              description="Optional: Share any additional availability information"
            />
          </div>
        </div>
      </div>
      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onPrevious}>
            <Icon name="ChevronLeft" size={16} className="mr-2" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">Step 4 of 5</span>
          </div>
          <Button 
            onClick={onNext}
            disabled={!isFormValid()}
            className="min-w-[120px]"
          >
            Next Step
            <Icon name="ChevronRight" size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPreferencesSection;