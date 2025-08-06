import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import CountdownTimer from './components/CountdownTimer';
import DonorMatchCard from './components/DonorMatchCard';
import HealthTimeline from './components/HealthTimeline';
import QuickActions from './components/QuickActions';
import ActivityFeed from './components/ActivityFeed';
import MetricsCards from './components/MetricsCards';
import VoiceAssistant from './components/VoiceAssistant';
import BottomNavigation from './components/BottomNavigation';

const PatientCaregiverDashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data
  const nextTransfusionDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
  const urgencyLevel = 'warning'; // normal, warning, critical

  const currentDonor = {
    id: 'donor_001',
    name: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bloodType: 'B+',
    location: 'Coimbatore',
    distance: 3.2,
    compatibilityScore: 94,
    rating: 4.8,
    totalDonations: 12,
    availableTime: 'Today 2:00 PM - 6:00 PM'
  };

  const timelineData = [
    {
      id: 'timeline_001',
      type: 'prediction',
      status: 'upcoming',
      title: 'AI Predicted Transfusion',
      description: 'Next transfusion predicted based on health patterns',
      date: '08 Aug 2025',
      details: {
        hemoglobin: '7.2 g/dL (predicted)',
        unitsTransfused: '2 units (recommended)'
      },
      actions: [
        { label: 'Find Donors', path: '/ai-powered-donor-matching' },
        { label: 'Schedule', path: '/appointments' }
      ]
    },
    {
      id: 'timeline_002',
      type: 'transfusion',
      status: 'completed',
      title: 'Blood Transfusion Completed',
      description: 'Successful transfusion with excellent compatibility',
      date: '25 Jul 2025',
      details: {
        hemoglobin: '6.8 g/dL → 11.2 g/dL',
        unitsTransfused: '2 units',
        donor: 'Priya Sharma',
        hospital: 'Apollo Hospital'
      }
    },
    {
      id: 'timeline_003',
      type: 'appointment',
      status: 'completed',
      title: 'Pre-transfusion Check-up',
      description: 'Routine health assessment before transfusion',
      date: '24 Jul 2025',
      details: {
        hemoglobin: '6.8 g/dL',
        hospital: 'Apollo Hospital'
      }
    },
    {
      id: 'timeline_004',
      type: 'transfusion',
      status: 'completed',
      title: 'Blood Transfusion Completed',
      description: 'Regular monthly transfusion',
      date: '18 Jun 2025',
      details: {
        hemoglobin: '7.1 g/dL → 11.5 g/dL',
        unitsTransfused: '2 units',
        donor: 'Arun Krishnan',
        hospital: 'Government Hospital'
      }
    }
  ];

  const recentActivities = [
    {
      id: 'activity_001',
      type: 'donor_confirmed',
      title: 'Donor Confirmed Availability',
      description: 'Rajesh Kumar confirmed for Aug 8th appointment',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      metadata: {
        donor: 'Rajesh Kumar',
        compatibility: 94
      }
    },
    {
      id: 'activity_002',
      type: 'match_found',
      title: 'New Donor Match Found',
      description: 'AI found 3 compatible donors in your area',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      actionRequired: true
    },
    {
      id: 'activity_003',
      type: 'appointment_scheduled',
      title: 'Appointment Scheduled',
      description: 'Transfusion appointment booked for Aug 8th',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      metadata: {
        hospital: 'Apollo Hospital'
      }
    },
    {
      id: 'activity_004',
      type: 'reminder',
      title: 'Iron Chelation Reminder',
      description: 'Time for your evening medication',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      actionRequired: true
    },
    {
      id: 'activity_005',
      type: 'system_update',
      title: 'Health Data Updated',
      description: 'Latest lab results have been processed',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ];

  const metrics = {
    successfulTransfusions: 24,
    transfusionTrend: 8,
    averageWaitTime: 2.5,
    waitTimeTrend: -15,
    donorReliability: 96,
    reliabilityTrend: 3,
    predictionAccuracy: 94,
    accuracyTrend: 2
  };

  const notificationCounts = {
    dashboard: 0,
    appointments: 1,
    donors: 2,
    emergency: 0
  };

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Handlers
  const handleFindBackupDonor = () => {
    window.location.href = '/ai-powered-donor-matching';
  };

  const handleScheduleAppointment = () => {
    window.location.href = '/appointments';
  };

  const handleEmergencyRequest = () => {
    setEmergencyActive(true);
    window.location.href = '/emergency-blood-request-system';
  };

  const handleContactDonor = (donorId) => {
    // Mock contact functionality
    alert(`Contacting donor ${donorId}...`);
  };

  const handleViewDonorProfile = (donorId) => {
    window.location.href = `/donor-profile/${donorId}`;
  };

  const handleTimelineNavigate = (path) => {
    window.location.href = path;
  };

  const handleViewAllActivities = () => {
    window.location.href = '/activities';
  };

  const handleVoiceCommand = (command) => {
    if (typeof command === 'boolean') {
      setIsVoiceListening(command);
    } else {
      // Process voice command
      console.log('Voice command:', command);
      setIsVoiceListening(false);
    }
  };

  const handleTabChange = (tabId, path) => {
    setActiveTab(tabId);
    if (path) {
      window.location.href = path;
    }
  };

  const handleEmergencyTrigger = () => {
    setEmergencyActive(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        userRole="caregiver"
        emergencyActive={emergencyActive}
        notificationCount={3}
        onEmergencyTrigger={handleEmergencyTrigger}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20 lg:pb-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {currentLanguage === 'tamil' ? 'வணக்கம், அருண்!' : 'Welcome back, Arun!'}
          </h1>
          <p className="text-text-secondary">
            {currentLanguage === 'tamil' ?'உங்கள் குழந்தையின் சிகிச்சை நிலையை கண்காணிக்கவும்' :'Monitor your child\'s treatment progress and manage appointments'
            }
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left Column - Metrics & Voice Assistant */}
          <div className="lg:col-span-3 space-y-6">
            <MetricsCards metrics={metrics} />
            <VoiceAssistant
              onVoiceCommand={handleVoiceCommand}
              isListening={isVoiceListening}
              language={currentLanguage}
            />
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-6 space-y-6">
            <CountdownTimer
              nextTransfusionDate={nextTransfusionDate}
              urgencyLevel={urgencyLevel}
            />
            <DonorMatchCard
              donor={currentDonor}
              onContact={handleContactDonor}
              onViewProfile={handleViewDonorProfile}
            />
            <HealthTimeline
              timelineData={timelineData}
              onNavigate={handleTimelineNavigate}
            />
          </div>

          {/* Right Column - Actions & Activity */}
          <div className="lg:col-span-3 space-y-6">
            <QuickActions
              onFindBackupDonor={handleFindBackupDonor}
              onScheduleAppointment={handleScheduleAppointment}
              onEmergencyRequest={handleEmergencyRequest}
            />
            <ActivityFeed
              activities={recentActivities}
              onViewAll={handleViewAllActivities}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          <CountdownTimer
            nextTransfusionDate={nextTransfusionDate}
            urgencyLevel={urgencyLevel}
          />
          
          <DonorMatchCard
            donor={currentDonor}
            onContact={handleContactDonor}
            onViewProfile={handleViewDonorProfile}
          />

          <QuickActions
            onFindBackupDonor={handleFindBackupDonor}
            onScheduleAppointment={handleScheduleAppointment}
            onEmergencyRequest={handleEmergencyRequest}
          />

          <MetricsCards metrics={metrics} />

          <HealthTimeline
            timelineData={timelineData}
            onNavigate={handleTimelineNavigate}
          />

          <ActivityFeed
            activities={recentActivities}
            onViewAll={handleViewAllActivities}
          />

          <VoiceAssistant
            onVoiceCommand={handleVoiceCommand}
            isListening={isVoiceListening}
            language={currentLanguage}
          />
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        notificationCounts={notificationCounts}
      />
    </div>
  );
};

export default PatientCaregiverDashboard;