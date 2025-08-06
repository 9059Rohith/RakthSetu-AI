import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import AppointmentTimeline from './components/AppointmentTimeline';
import LiveMapView from './components/LiveMapView';
import DonorStatusCards from './components/DonorStatusCards';
import NotificationCenter from './components/NotificationCenter';
import PatientPreparationChecklist from './components/PatientPreparationChecklist';
import CommunicationHub from './components/CommunicationHub';

const RealTimeDonorAvailabilityTracking = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Mock data for the current appointment
  const currentAppointment = {
    id: 1,
    patientName: 'Arun Kumar',
    bloodType: 'B+',
    donorId: 1,
    scheduledTime: new Date(Date.now() + 900000), // 15 minutes from now
    status: 'active',
    hospitalLocation: { lat: 11.0168, lng: 76.9558 }
  };

  const mockPatient = {
    name: 'Arun Kumar',
    age: '12 years',
    bloodType: 'B+',
    condition: 'Thalassemia Major',
    lastTransfusion: '3 weeks ago'
  };

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    // Auto-refresh data every 30 seconds
    const interval = setInterval(() => {
      // Simulate real-time updates
      console.log('Refreshing donor tracking data...');
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleContactDonor = (donorId, method = 'call') => {
    if (method === 'call') {
      // Simulate phone call
      alert(`Calling donor ${donorId}...`);
    } else if (method === 'message') {
      // Open messaging interface
      setActiveView('communication');
    }
  };

  const handleActivateBackup = (donorId) => {
    if (donorId === 'expand') {
      // Expand search radius
      alert('Expanding search radius to find more donors...');
    } else {
      // Activate specific backup donor
      alert(`Activating backup donor ${donorId} as primary...`);
    }
  };

  const handleViewProfile = (donorId) => {
    alert(`Viewing profile for donor ${donorId}...`);
  };

  const handleViewDetails = (appointmentId) => {
    alert(`Viewing details for appointment ${appointmentId}...`);
  };

  const handleEmergencyTrigger = () => {
    setEmergencyMode(true);
    alert('Emergency mode activated! Expanding search and notifying all available donors...');
  };

  const handleNotificationAction = (notificationId, action) => {
    switch (action) {
      case 'track_donor':
        setActiveView('map');
        break;
      case 'contact_donor':
        setActiveView('communication');
        break;
      case 'activate_backup': handleActivateBackup('expand');
        break;
      case 'notify_hospital':
        alert('Hospital notified of potential delay...');
        break;
      case 'view_profile':
        handleViewProfile(1);
        break;
      case 'send_message': setActiveView('communication');
        break;
      default:
        console.log(`Action ${action} for notification ${notificationId}`);
    }
  };

  const handleMarkAsRead = (notificationId) => {
    console.log(`Marking notification ${notificationId} as read`);
  };

  const handleMarkAllAsRead = () => {
    console.log('Marking all notifications as read');
  };

  const handleUpdateChecklist = (checkedItems) => {
    console.log('Updated checklist:', checkedItems);
  };

  const handleContactHospital = () => {
    alert('Contacting hospital staff...');
  };

  const handleSendMessage = (chatId, message) => {
    console.log(`Sending message to chat ${chatId}:`, message);
  };

  const handleStartChat = (type) => {
    if (type === 'emergency') {
      alert('Starting emergency broadcast...');
    } else if (type === 'broadcast') {
      alert('Starting group broadcast...');
    }
  };

  const handleTranslate = (messageId) => {
    console.log(`Translating message ${messageId}`);
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'timeline':
        return 'Appointment Timeline';
      case 'map':
        return 'Live Tracking Map';
      case 'donors':
        return 'Donor Management';
      case 'notifications':
        return 'Notification Center';
      case 'checklist':
        return 'Patient Preparation';
      case 'communication':
        return 'Communication Hub';
      default:
        return 'Real-time Tracking Overview';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Real-time Donor Availability & Tracking - RaktaSetu AI</title>
        <meta name="description" content="Track donor location and appointment progress in real-time with live updates and communication tools" />
      </Helmet>
      {/* Emergency Alert Banner */}
      {emergencyMode && (
        <div className="bg-error text-error-foreground px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <Icon name="AlertTriangle" size={20} />
            <span className="font-medium">Emergency Mode Active - All available donors notified</span>
            <button
              onClick={() => setEmergencyMode(false)}
              className="ml-4 px-3 py-1 bg-error-foreground text-error rounded text-sm hover:bg-error-foreground/90 transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history?.back()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{getViewTitle()}</h1>
                <p className="text-sm text-muted-foreground">
                  Live tracking for {currentAppointment?.patientName} • {currentAppointment?.bloodType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Auto-refresh indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>

              {/* Emergency button */}
              <button
                onClick={handleEmergencyTrigger}
                className="flex items-center gap-2 px-4 py-2 bg-error text-error-foreground rounded-lg hover:bg-error/90 transition-colors"
              >
                <Icon name="AlertTriangle" size={16} />
                <span className="hidden sm:inline">Emergency</span>
              </button>

              {/* View selector */}
              <select
                value={activeView}
                onChange={(e) => setActiveView(e?.target?.value)}
                className="px-3 py-2 bg-muted text-foreground rounded-lg border border-border"
              >
                <option value="overview">Overview</option>
                <option value="timeline">Timeline</option>
                <option value="map">Map View</option>
                <option value="donors">Donors</option>
                <option value="notifications">Notifications</option>
                <option value="checklist">Checklist</option>
                <option value="communication">Communication</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Timeline and Map */}
            <div className="lg:col-span-2 space-y-6">
              <AppointmentTimeline
                appointment={currentAppointment}
                onContactDonor={handleContactDonor}
                onViewDetails={handleViewDetails}
              />
              
              <LiveMapView
                donors={[]}
                selectedDonor={selectedDonor}
                onDonorSelect={setSelectedDonor}
                hospitalLocation={currentAppointment?.hospitalLocation}
              />
            </div>

            {/* Right Column - Status and Notifications */}
            <div className="space-y-6">
              <NotificationCenter
                notifications={[]}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onNotificationAction={handleNotificationAction}
              />
              
              <div className="bg-card rounded-lg border border-border p-4">
                <h3 className="font-semibold text-card-foreground mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveView('donors')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted rounded-lg transition-colors"
                  >
                    <Icon name="Users" size={16} />
                    <span>Manage Donors</span>
                  </button>
                  <button
                    onClick={() => setActiveView('checklist')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted rounded-lg transition-colors"
                  >
                    <Icon name="CheckSquare" size={16} />
                    <span>Patient Checklist</span>
                  </button>
                  <button
                    onClick={() => setActiveView('communication')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted rounded-lg transition-colors"
                  >
                    <Icon name="MessageCircle" size={16} />
                    <span>Communications</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'timeline' && (
          <AppointmentTimeline
            appointment={currentAppointment}
            onContactDonor={handleContactDonor}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeView === 'map' && (
          <LiveMapView
            donors={[]}
            selectedDonor={selectedDonor}
            onDonorSelect={setSelectedDonor}
            hospitalLocation={currentAppointment?.hospitalLocation}
          />
        )}

        {activeView === 'donors' && (
          <DonorStatusCards
            donors={[]}
            onContactDonor={handleContactDonor}
            onActivateBackup={handleActivateBackup}
            onViewProfile={handleViewProfile}
          />
        )}

        {activeView === 'notifications' && (
          <NotificationCenter
            notifications={[]}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onNotificationAction={handleNotificationAction}
          />
        )}

        {activeView === 'checklist' && (
          <PatientPreparationChecklist
            patient={mockPatient}
            onUpdateChecklist={handleUpdateChecklist}
            onContactHospital={handleContactHospital}
          />
        )}

        {activeView === 'communication' && (
          <CommunicationHub
            activeChats={[]}
            onSendMessage={handleSendMessage}
            onStartChat={handleStartChat}
            onTranslate={handleTranslate}
          />
        )}
      </div>
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border lg:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { key: 'overview', icon: 'LayoutDashboard', label: 'Overview' },
            { key: 'map', icon: 'Map', label: 'Map' },
            { key: 'donors', icon: 'Users', label: 'Donors' },
            { key: 'communication', icon: 'MessageCircle', label: 'Chat' }
          ]?.map((item) => (
            <button
              key={item?.key}
              onClick={() => setActiveView(item?.key)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeView === item?.key
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={item?.icon} size={20} />
              <span className="text-xs">{item?.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeDonorAvailabilityTracking;