import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const PersonalInfoSection = ({ formData, onUpdate, onNext }) => {
  const [socialLogin, setSocialLogin] = useState(false);

  const bloodGroups = [
    { value: 'A+', label: 'A Positive (A+)' },
    { value: 'A-', label: 'A Negative (A-)' },
    { value: 'B+', label: 'B Positive (B+)' },
    { value: 'B-', label: 'B Negative (B-)' },
    { value: 'AB+', label: 'AB Positive (AB+)' },
    { value: 'AB-', label: 'AB Negative (AB-)' },
    { value: 'O+', label: 'O Positive (O+)' },
    { value: 'O-', label: 'O Negative (O-)' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const stateOptions = [
    { value: 'tamil_nadu', label: 'Tamil Nadu' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'andhra_pradesh', label: 'Andhra Pradesh' }
  ];

  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleSocialLogin = (platform) => {
    setSocialLogin(true);
    // Mock social login data
    const mockData = {
      fullName: "Arjun Kumar",
      email: "arjun.kumar@gmail.com",
      phone: "+91 98765 43210",
      dateOfBirth: "1998-05-15",
      gender: "male"
    };
    
    Object.keys(mockData)?.forEach(key => {
      onUpdate({ [key]: mockData?.[key] });
    });
  };

  const isFormValid = () => {
    return formData?.fullName && formData?.email && formData?.phone && 
           formData?.dateOfBirth && formData?.gender && formData?.bloodGroup;
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="User" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Personal Information</h2>
          <p className="text-sm text-text-secondary">Let's start with your basic details</p>
        </div>
      </div>
      {/* Social Login Options */}
      {!socialLogin && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium text-text-primary mb-3">Quick signup with social media</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin('google')}
              className="flex-1"
            >
              <Icon name="Chrome" size={16} className="mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin('facebook')}
              className="flex-1"
            >
              <Icon name="Facebook" size={16} className="mr-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSocialLogin('instagram')}
              className="flex-1"
            >
              <Icon name="Instagram" size={16} className="mr-2" />
              Instagram
            </Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData?.fullName || ''}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          required
          className="col-span-1 md:col-span-2"
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={formData?.email || ''}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          description="We'll use this for appointment notifications"
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={formData?.phone || ''}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          description="For emergency contact and SMS alerts"
          required
        />

        <Input
          label="Date of Birth"
          type="date"
          value={formData?.dateOfBirth || ''}
          onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
          description="Must be 18-65 years old"
          required
        />

        <Select
          label="Gender"
          options={genderOptions}
          value={formData?.gender || ''}
          onChange={(value) => handleInputChange('gender', value)}
          placeholder="Select gender"
          required
        />

        <Select
          label="Blood Group"
          options={bloodGroups}
          value={formData?.bloodGroup || ''}
          onChange={(value) => handleInputChange('bloodGroup', value)}
          placeholder="Select your blood group"
          description="If unsure, we'll help you verify"
          required
        />

        <Input
          label="Weight (kg)"
          type="number"
          placeholder="65"
          value={formData?.weight || ''}
          onChange={(e) => handleInputChange('weight', e?.target?.value)}
          description="Minimum 50kg required"
          min="45"
          max="150"
        />

        <Input
          label="Address"
          type="text"
          placeholder="Enter your address"
          value={formData?.address || ''}
          onChange={(e) => handleInputChange('address', e?.target?.value)}
          className="col-span-1 md:col-span-2"
        />

        <Input
          label="City"
          type="text"
          placeholder="Coimbatore"
          value={formData?.city || ''}
          onChange={(e) => handleInputChange('city', e?.target?.value)}
        />

        <Select
          label="State"
          options={stateOptions}
          value={formData?.state || ''}
          onChange={(value) => handleInputChange('state', value)}
          placeholder="Select state"
        />

        <Input
          label="PIN Code"
          type="text"
          placeholder="641001"
          value={formData?.pinCode || ''}
          onChange={(e) => handleInputChange('pinCode', e?.target?.value)}
          pattern="[0-9]{6}"
          maxLength="6"
        />

        <Input
          label="Occupation"
          type="text"
          placeholder="Software Engineer"
          value={formData?.occupation || ''}
          onChange={(e) => handleInputChange('occupation', e?.target?.value)}
        />
      </div>
      {/* Profile Photo Upload */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Profile Photo (Optional)
        </label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {formData?.profilePhoto ? (
              <Image 
                src={formData?.profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="Camera" size={24} className="text-text-secondary" />
            )}
          </div>
          <div>
            <Button variant="outline" size="sm">
              <Icon name="Upload" size={16} className="mr-2" />
              Upload Photo
            </Button>
            <p className="text-xs text-text-secondary mt-1">
              JPG, PNG up to 2MB
            </p>
          </div>
        </div>
      </div>
      {/* Progress Indicator */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">Step 1 of 5</span>
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

export default PersonalInfoSection;