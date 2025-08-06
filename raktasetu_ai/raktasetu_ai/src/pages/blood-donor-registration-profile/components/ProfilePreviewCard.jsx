import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfilePreviewCard = ({ formData }) => {
  const getCompletionPercentage = () => {
    const fields = [
      'fullName', 'email', 'phone', 'bloodGroup', 'dateOfBirth',
      'medicalAnswers', 'verificationStatus', 'availableDays', 
      'timeSlots', 'travelRadius', 'donationGoals'
    ];
    
    const completedFields = fields?.filter(field => {
      const value = formData?.[field];
      if (Array.isArray(value)) return value?.length > 0;
      if (typeof value === 'object') return Object.keys(value || {})?.length > 0;
      return value && value?.toString()?.trim() !== '';
    });
    
    return Math.round((completedFields?.length / fields?.length) * 100);
  };

  const getBloodTypeCompatibility = () => {
    const bloodType = formData?.bloodGroup;
    const compatibilityMap = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    };
    
    return compatibilityMap?.[bloodType] || [];
  };

  const getAvailabilityScore = () => {
    const days = formData?.availableDays?.length || 0;
    const timeSlots = formData?.timeSlots?.length || 0;
    const emergency = formData?.emergencyAvailable ? 1 : 0;
    
    return Math.min(100, ((days * 10) + (timeSlots * 15) + (emergency * 25)));
  };

  const completionPercentage = getCompletionPercentage();
  const compatibleTypes = getBloodTypeCompatibility();
  const availabilityScore = getAvailabilityScore();

  return (
    <div className="bg-surface rounded-xl border border-border p-6 sticky top-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
          {formData?.profilePhoto ? (
            <Image 
              src={formData?.profilePhoto} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="User" size={32} className="text-text-secondary" />
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-text-primary">
          {formData?.fullName || 'Your Name'}
        </h3>
        <p className="text-sm text-text-secondary">
          {formData?.occupation || 'Occupation'} • {formData?.city || 'City'}
        </p>
      </div>
      {/* Profile Completion */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Profile Completion</span>
          <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      {/* Blood Type Info */}
      {formData?.bloodGroup && (
        <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-error rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{formData?.bloodGroup}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">Blood Type</div>
              <div className="text-xs text-text-secondary">
                {formData?.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'}
              </div>
            </div>
          </div>
          
          {compatibleTypes?.length > 0 && (
            <div>
              <div className="text-xs font-medium text-text-primary mb-2">Can help patients with:</div>
              <div className="flex flex-wrap gap-1">
                {compatibleTypes?.slice(0, 4)?.map((type) => (
                  <span key={type} className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                    {type}
                  </span>
                ))}
                {compatibleTypes?.length > 4 && (
                  <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                    +{compatibleTypes?.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Availability Score */}
      {availabilityScore > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Availability Score</span>
            <span className={`text-sm font-bold ${
              availabilityScore >= 80 ? 'text-success' : 
              availabilityScore >= 60 ? 'text-warning' : 'text-error'
            }`}>
              {availabilityScore}%
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                availabilityScore >= 80 ? 'bg-success' : 
                availabilityScore >= 60 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${availabilityScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Based on your availability preferences
          </p>
        </div>
      )}
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-bold text-primary">0</div>
          <div className="text-xs text-text-secondary">Donations</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-lg font-bold text-primary">0</div>
          <div className="text-xs text-text-secondary">Lives Saved</div>
        </div>
      </div>
      {/* Donation Goals */}
      {formData?.donationGoals?.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-text-primary mb-3">Motivation</h4>
          <div className="space-y-2">
            {formData?.donationGoals?.slice(0, 3)?.map((goal) => (
              <div key={goal} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-text-secondary capitalize">
                  {goal?.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Emergency Availability */}
      {formData?.emergencyAvailable && (
        <div className="mb-6 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Emergency Available</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Can respond to urgent blood requests
          </p>
        </div>
      )}
      {/* Contact Info */}
      <div className="space-y-2 text-xs text-text-secondary">
        {formData?.email && (
          <div className="flex items-center gap-2">
            <Icon name="Mail" size={12} />
            <span className="truncate">{formData?.email}</span>
          </div>
        )}
        {formData?.phone && (
          <div className="flex items-center gap-2">
            <Icon name="Phone" size={12} />
            <span>{formData?.phone}</span>
          </div>
        )}
        {formData?.city && (
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={12} />
            <span>{formData?.city}, {formData?.state}</span>
          </div>
        )}
      </div>
      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          disabled={completionPercentage < 100}
        >
          <Icon name="Eye" size={16} className="mr-2" />
          Preview Full Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfilePreviewCard;