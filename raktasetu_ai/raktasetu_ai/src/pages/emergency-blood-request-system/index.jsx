import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import EmergencyForm from './components/EmergencyForm';
import DonorResponseTracker from './components/DonorResponseTracker';
import HospitalCoordination from './components/HospitalCoordination';
import EmergencyStatusPanel from './components/EmergencyStatusPanel';
import VoiceEmergencyReporter from './components/VoiceEmergencyReporter';

const EmergencyBloodRequestSystem = () => {
  const [currentStep, setCurrentStep] = useState('form');
  const [emergencyData, setEmergencyData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [voiceReportActive, setVoiceReportActive] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(true);

  // Mock patient data
  const patientData = {
    id: 'P001',
    name: 'Arjun Krishnan',
    bloodType: 'B+',
    rareAntigens: ['Kell', 'Duffy'],
    emergencyContact: '+91 98765 43210',
    medicalHistory: 'Thalassemia Major, regular transfusions',
    lastTransfusion: '2025-01-02'
  };

  useEffect(() => {
    // Auto-scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleEmergencySubmit = async (formData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setEmergencyData(formData);
      setCurrentStep('tracking');
      setIsSubmitting(false);
    }, 2000);
  };

  const handleDonorSelect = (donor) => {
    setSelectedDonor(donor);
  };

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleVoiceReport = (voiceData) => {
    // Process voice report and auto-fill form
    const processedData = {
      patientId: patientData?.id,
      bloodType: voiceData?.processed?.bloodType || patientData?.bloodType,
      urgencyLevel: voiceData?.processed?.urgency,
      unitsRequired: '2',
      location: 'Current Location (Voice Detected)',
      additionalNotes: `Voice Report: ${voiceData?.transcript}`,
      contactNumber: patientData?.emergencyContact
    };

    setEmergencyData(processedData);
    setCurrentStep('tracking');
  };

  const handleSocialShare = () => {
    const shareText = `🚨 EMERGENCY BLOOD NEEDED 🚨\n\nBlood Type: ${patientData?.bloodType}\nLocation: Coimbatore\nUrgent: Thalassemia patient needs immediate transfusion\n\nPlease share if you can help or know someone who can donate.\n\n#BloodDonation #SaveLives #Coimbatore`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Blood Request',
        text: shareText,
        url: window.location?.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard?.writeText(shareText);
      alert('Emergency message copied to clipboard. Please share on social media!');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'form':
        return (
          <div className="space-y-6">
            <EmergencyForm
              onSubmit={handleEmergencySubmit}
              patientData={patientData}
              isSubmitting={isSubmitting}
            />
            
            <VoiceEmergencyReporter
              onVoiceReport={handleVoiceReport}
              isActive={voiceReportActive}
              onToggle={setVoiceReportActive}
            />
          </div>
        );
      
      case 'tracking':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <DonorResponseTracker
                requestId={emergencyData?.patientId}
                onDonorSelect={handleDonorSelect}
              />
              
              <HospitalCoordination
                patientLocation={emergencyData?.location}
                bloodType={emergencyData?.bloodType}
                onHospitalSelect={handleHospitalSelect}
              />
            </div>
            
            <div className="lg:col-span-1">
              <EmergencyStatusPanel
                requestData={emergencyData}
                onStatusUpdate={(status) => console.log('Status updated:', status)}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Emergency Blood Request System - RaktaSetu AI</title>
        <meta name="description" content="Critical blood sourcing with priority matching and immediate donor notification capabilities for emergency situations." />
      </Helmet>
      <div className="min-h-screen bg-red-50">
        {/* Emergency Header */}
        <div className="bg-red-600 text-white py-4 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-red-600 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold">Emergency Blood Request</h1>
                  <p className="text-red-100 text-sm">Critical blood sourcing system activated</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Emergency Timer */}
                <div className="hidden md:flex items-center gap-2 bg-red-700 px-3 py-2 rounded-lg">
                  <Icon name="Clock" size={16} />
                  <span className="text-sm font-mono">
                    {new Date()?.toLocaleTimeString()}
                  </span>
                </div>

                {/* Social Share */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-700"
                  onClick={handleSocialShare}
                >
                  <Icon name="Share2" size={16} className="mr-2" />
                  Share Alert
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="bg-white border-b border-gray-200 py-3 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Home" size={14} />
              <span>RaktaSetu AI</span>
              <Icon name="ChevronRight" size={14} />
              <span className="text-red-600 font-medium">Emergency Blood Request</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-white border-b border-gray-200 py-4 px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-8">
              <div className={`flex items-center gap-2 ${
                currentStep === 'form' ? 'text-red-600' : 'text-green-600'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'form' 
                    ? 'bg-red-100 text-red-600' :'bg-green-100 text-green-600'
                }`}>
                  <Icon name={currentStep === 'form' ? 'Edit' : 'Check'} size={16} />
                </div>
                <span className="font-medium">Emergency Form</span>
              </div>

              <div className={`w-16 h-0.5 ${
                currentStep === 'tracking' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>

              <div className={`flex items-center gap-2 ${
                currentStep === 'tracking' ? 'text-red-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'tracking' ?'bg-red-100 text-red-600' :'bg-gray-100 text-gray-400'
                }`}>
                  <Icon name="Activity" size={16} />
                </div>
                <span className="font-medium">Live Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 px-4 lg:px-6">
          {renderStepContent()}
        </div>

        {/* Emergency Contact Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Phone" size={16} />
              <span className="text-sm font-medium">Emergency: 108</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-red-700"
                onClick={() => window.open('tel:108')}
              >
                Call Now
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions Floating Menu - Desktop */}
        <div className="hidden lg:block fixed bottom-6 right-6 z-50">
          <div className="space-y-3">
            <Button
              variant="destructive"
              size="icon"
              className="w-14 h-14 rounded-full shadow-lg animate-pulse"
              onClick={() => window.open('tel:108')}
            >
              <Icon name="Phone" size={24} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg bg-white"
              onClick={handleSocialShare}
            >
              <Icon name="Share2" size={20} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg bg-white"
              onClick={() => setCurrentStep('form')}
            >
              <Icon name="RotateCcw" size={20} />
            </Button>
          </div>
        </div>

        {/* Emergency Alert Banner */}
        {emergencyActive && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-2 text-center text-sm font-medium z-40 animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Icon name="AlertTriangle" size={16} />
              <span>EMERGENCY MODE ACTIVE - All systems prioritized for critical response</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmergencyBloodRequestSystem;