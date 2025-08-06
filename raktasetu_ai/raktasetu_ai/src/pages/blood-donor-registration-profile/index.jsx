import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PersonalInfoSection from './components/PersonalInfoSection';
import MedicalEligibilitySection from './components/MedicalEligibilitySection';
import BloodTypeVerificationSection from './components/BloodTypeVerificationSection';
import AvailabilityPreferencesSection from './components/AvailabilityPreferencesSection';
import GamificationSection from './components/GamificationSection';
import ProfilePreviewCard from './components/ProfilePreviewCard';
import CompatibilityExamples from './components/CompatibilityExamples';

const BloodDonorRegistrationProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    weight: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    occupation: '',
    profilePhoto: null,
    
    // Medical Information
    medicalAnswers: {},
    
    // Blood Type Verification
    verificationDocument: null,
    verificationStatus: 'pending',
    documentType: '',
    lastBloodTestDate: '',
    rareAntigens: [],
    aiAnalysis: null,
    
    // Availability Preferences
    availableDays: [],
    timeSlots: [],
    travelRadius: '',
    preferredArea: '',
    preferredLocationTypes: [],
    emergencyAvailable: false,
    donationFrequency: '',
    availabilityNotes: '',
    
    // Gamification & Community
    donationGoals: [],
    sharePreferences: {},
    personalStory: '',
    shareStoryPublicly: false,
    allowStoryInNewsletter: false,
    achievementNotifications: true,
    challengeNotifications: true,
    leaderboardNotifications: false,
    friendActivityNotifications: true,
    joinedChallenges: []
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Personal Info', component: PersonalInfoSection },
    { id: 2, title: 'Medical Eligibility', component: MedicalEligibilitySection },
    { id: 3, title: 'Blood Verification', component: BloodTypeVerificationSection },
    { id: 4, title: 'Availability', component: AvailabilityPreferencesSection },
    { id: 5, title: 'Community', component: GamificationSection }
  ];

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Mock API submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      setShowSuccessModal(true);
      
      // Store registration data in localStorage for demo
      localStorage.setItem('donorProfile', JSON.stringify({
        ...formData,
        registrationDate: new Date()?.toISOString(),
        donorId: 'DN' + Date.now()?.toString()?.slice(-6),
        status: 'active'
      }));
      
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Redirect to dashboard or donor matching page
    window.location.href = '/ai-powered-donor-matching';
  };

  const getCurrentStepComponent = () => {
    const StepComponent = steps?.[currentStep - 1]?.component;
    return (
      <StepComponent
        formData={formData}
        onUpdate={updateFormData}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    );
  };

  const getProgressPercentage = () => {
    return (currentStep / steps?.length) * 100;
  };

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('donorRegistrationDraft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('donorRegistrationDraft', JSON.stringify(formData));
  }, [formData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <div className="bg-surface border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history?.back()}
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">Blood Donor Registration</h1>
                <p className="text-sm text-text-secondary">Step {currentStep} of {steps?.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                {steps?.map((step) => (
                  <div
                    key={step?.id}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      step?.id === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step?.id < currentStep
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-text-secondary'
                    }`}
                  >
                    {step?.title}
                  </div>
                ))}
              </div>
              
              <div className="w-32 h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {getCurrentStepComponent()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Preview */}
            <ProfilePreviewCard formData={formData} />
            
            {/* Compatibility Examples - Show after blood type is selected */}
            {formData?.bloodGroup && currentStep >= 3 && (
              <CompatibilityExamples userBloodType={formData?.bloodGroup} />
            )}
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl border border-border p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Registration Successful!
              </h2>
              
              <p className="text-text-secondary mb-6">
                Welcome to RaktaSetu AI! Your donor profile has been created successfully. 
                You'll receive a confirmation email shortly.
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg text-left">
                  <div className="text-sm font-medium text-text-primary">Your Donor ID</div>
                  <div className="text-lg font-bold text-primary">
                    DN{Date.now()?.toString()?.slice(-6)}
                  </div>
                </div>
                
                <div className="text-sm text-text-secondary">
                  <p>Next steps:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Complete medical verification (if pending)</li>
                    <li>Set up donation appointments</li>
                    <li>Join community challenges</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={handleSuccessModalClose} className="flex-1">
                  View Dashboard
                </Button>
                <Button onClick={handleSuccessModalClose} className="flex-1">
                  Find Matches
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl border border-border p-8 text-center">
            <Icon name="Loader2" size={32} className="mx-auto mb-4 text-primary animate-spin" />
            <p className="text-text-primary font-medium">Creating your donor profile...</p>
            <p className="text-text-secondary text-sm mt-2">This may take a few moments</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodDonorRegistrationProfile;