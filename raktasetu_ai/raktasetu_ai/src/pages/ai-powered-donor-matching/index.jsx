import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PatientRequirements from './components/PatientRequirements';
import DonorCard from './components/DonorCard';
import MatchingProgress from './components/MatchingProgress';
import FilterPanel from './components/FilterPanel';
import MapView from './components/MapView';
import EmergencyModePanel from './components/EmergencyModePanel';

const AIPoweredDonorMatching = () => {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [countdownTime, setCountdownTime] = useState(86400); // 24 hours in seconds
  const [analysisSteps, setAnalysisSteps] = useState({});
  const [filters, setFilters] = useState({
    maxDistance: '25',
    availability: 'now',
    bloodTypes: [],
    minCompatibility: '70',
    minReliability: '80',
    rareAntigens: [],
    priorityOnly: false,
    includePrevious: false
  });

  // Mock patient data
  const patientData = {
    id: "TH-2025-001",
    name: "Arjun Kumar",
    bloodType: "B-",
    rareAntigens: ["Kell (K)", "Duffy (Fya)"],
    location: "Coimbatore, Tamil Nadu",
    lastTransfusion: "2025-01-20",
    hemoglobin: "6.8",
    lat: 11.0168,
    lng: 76.9558
  };

  // Mock donor data
  const mockDonors = [
    {
      id: "D001",
      name: "Priya Sharma",
      profilePhoto: "https://randomuser.me/api/portraits/women/32.jpg",
      bloodType: "B-",
      compatibilityScore: 98,
      distance: 2.3,
      travelTime: 8,
      availabilityStatus: "available",
      lastDonation: "2024-11-15",
      reliabilityScore: 95,
      rating: 5,
      totalDonations: 12,
      rareAntigens: ["Kell (K)", "Duffy (Fya)"],
      isPriority: true
    },
    {
      id: "D002",
      name: "Rajesh Patel",
      profilePhoto: "https://randomuser.me/api/portraits/men/45.jpg",
      bloodType: "B-",
      compatibilityScore: 92,
      distance: 5.7,
      travelTime: 15,
      availabilityStatus: "available",
      lastDonation: "2024-12-10",
      reliabilityScore: 88,
      rating: 4,
      totalDonations: 8,
      rareAntigens: ["Kell (K)"],
      isPriority: false
    },
    {
      id: "D003",
      name: "Meera Krishnan",
      profilePhoto: "https://randomuser.me/api/portraits/women/28.jpg",
      bloodType: "O-",
      compatibilityScore: 85,
      distance: 3.1,
      travelTime: 12,
      availabilityStatus: "busy",
      lastDonation: "2024-10-22",
      reliabilityScore: 92,
      rating: 5,
      totalDonations: 15,
      rareAntigens: ["Duffy (Fya)"],
      isPriority: true
    },
    {
      id: "D004",
      name: "Vikram Singh",
      profilePhoto: "https://randomuser.me/api/portraits/men/35.jpg",
      bloodType: "B+",
      compatibilityScore: 78,
      distance: 8.2,
      travelTime: 22,
      availabilityStatus: "available",
      lastDonation: "2024-12-01",
      reliabilityScore: 85,
      rating: 4,
      totalDonations: 6,
      rareAntigens: [],
      isPriority: false
    },
    {
      id: "D005",
      name: "Anitha Reddy",
      profilePhoto: "https://randomuser.me/api/portraits/women/42.jpg",
      bloodType: "B-",
      compatibilityScore: 94,
      distance: 12.5,
      travelTime: 28,
      availabilityStatus: "available",
      lastDonation: "2024-11-28",
      reliabilityScore: 90,
      rating: 5,
      totalDonations: 10,
      rareAntigens: ["Kell (K)", "Duffy (Fya)", "Kidd (Jka)"],
      isPriority: true
    }
  ];

  const emergencyStats = {
    expandedRadius: 50,
    notifiedDonors: 127,
    responseTime: "3.2 min",
    availableDonors: 23
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownTime(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Matching simulation effect
  useEffect(() => {
    if (isMatching) {
      const steps = [
        'blood_type', 'antigens', 'location', 'availability', 
        'reliability', 'traffic', 'optimization'
      ];
      
      let currentStep = 0;
      const stepInterval = setInterval(() => {
        if (currentStep < steps?.length) {
          setAnalysisSteps(prev => ({
            ...prev,
            [steps?.[currentStep]]: { active: true, completed: false }
          }));
          
          setTimeout(() => {
            setAnalysisSteps(prev => ({
              ...prev,
              [steps?.[currentStep]]: { active: false, completed: true }
            }));
            setMatchingProgress((currentStep + 1) * (100 / steps?.length));
          }, 1500);
          
          currentStep++;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => setIsMatching(false), 1000);
        }
      }, 2000);

      return () => clearInterval(stepInterval);
    }
  }, [isMatching]);

  const handleStartMatching = () => {
    setIsMatching(true);
    setMatchingProgress(0);
    setAnalysisSteps({});
  };

  const handleEmergencyMode = () => {
    setEmergencyMode(true);
    handleStartMatching();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    handleStartMatching();
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      maxDistance: '25',
      availability: 'now',
      bloodTypes: [],
      minCompatibility: '70',
      minReliability: '80',
      rareAntigens: [],
      priorityOnly: false,
      includePrevious: false
    });
  };

  const handleContactDonor = (donorId, method) => {
    const donor = mockDonors?.find(d => d?.id === donorId);
    if (method === 'call') {
      alert(`Calling ${donor?.name}...`);
    } else {
      alert(`Sending message to ${donor?.name}...`);
    }
  };

  const handleViewProfile = (donorId) => {
    alert(`Viewing profile for donor ${donorId}`);
  };

  const handleBroadcastAlert = () => {
    alert("Critical alert broadcasted to all compatible donors in the region!");
  };

  const urgencyLevel = countdownTime < 3600 ? 'critical' : 
                      countdownTime < 21600 ? 'high' : 
                      countdownTime < 43200 ? 'medium' : 'low';

  const filteredDonors = mockDonors?.filter(donor => {
    if (filters?.priorityOnly && !donor?.isPriority) return false;
    if (filters?.minCompatibility && donor?.compatibilityScore < parseInt(filters?.minCompatibility)) return false;
    if (filters?.minReliability && donor?.reliabilityScore < parseInt(filters?.minReliability)) return false;
    if (filters?.maxDistance !== 'unlimited' && donor?.distance > parseInt(filters?.maxDistance)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary flex items-center gap-3">
              <Icon name="Brain" size={32} className="text-primary" />
              AI-Powered Donor Matching
            </h1>
            <p className="text-text-secondary mt-1">
              Advanced compatibility analysis for optimal donor-patient matching
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowMap(!showMap)}
              iconName="Map"
              iconPosition="left"
              className="hidden lg:flex"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
            <Button
              variant={isMatching ? "outline" : "default"}
              onClick={handleStartMatching}
              disabled={isMatching}
              loading={isMatching}
              iconName="Search"
              iconPosition="left"
            >
              {isMatching ? 'Analyzing...' : 'Start AI Matching'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Filters */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
              emergencyMode={emergencyMode}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Patient Requirements */}
            <PatientRequirements
              patient={patientData}
              urgencyLevel={urgencyLevel}
              countdownTime={countdownTime}
              onEmergencyMode={handleEmergencyMode}
            />

            {/* Emergency Mode Panel */}
            <EmergencyModePanel
              isActive={emergencyMode}
              onActivate={handleEmergencyMode}
              onDeactivate={() => setEmergencyMode(false)}
              emergencyStats={emergencyStats}
              onBroadcastAlert={handleBroadcastAlert}
            />

            {/* Matching Progress */}
            <MatchingProgress
              isMatching={isMatching}
              progress={matchingProgress}
              analysisSteps={analysisSteps}
              emergencyMode={emergencyMode}
            />

            {/* Results Header */}
            {!isMatching && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                  Compatible Donors ({filteredDonors?.length})
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMap(!showMap)}
                    iconName="Map"
                    iconPosition="left"
                    className="lg:hidden"
                  >
                    Map
                  </Button>
                  <select className="text-sm border border-border rounded px-2 py-1 bg-surface">
                    <option>Sort by Compatibility</option>
                    <option>Sort by Distance</option>
                    <option>Sort by Availability</option>
                    <option>Sort by Rating</option>
                  </select>
                </div>
              </div>
            )}

            {/* Donor Cards */}
            {!isMatching && (
              <div className="space-y-4">
                {filteredDonors?.map((donor) => (
                  <DonorCard
                    key={donor?.id}
                    donor={donor}
                    onContact={handleContactDonor}
                    onViewProfile={handleViewProfile}
                    emergencyMode={emergencyMode}
                  />
                ))}
                
                {filteredDonors?.length === 0 && (
                  <div className="text-center py-12 bg-surface border border-border rounded-lg">
                    <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">No Compatible Donors Found</h3>
                    <p className="text-text-secondary mb-4">
                      Try adjusting your filters or activate emergency mode for expanded search
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button variant="outline" onClick={handleResetFilters}>
                        Reset Filters
                      </Button>
                      <Button variant="destructive" onClick={handleEmergencyMode}>
                        Emergency Mode
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-1">
            {showMap && (
              <div className="sticky top-6">
                <MapView
                  donors={filteredDonors}
                  patientLocation={patientData}
                  isVisible={showMap}
                  onToggle={() => setShowMap(false)}
                  emergencyMode={emergencyMode}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <div className="flex flex-col gap-3">
            {emergencyMode && (
              <Button
                variant="destructive"
                size="icon"
                className="w-14 h-14 rounded-full shadow-medium animate-pulse"
                onClick={handleBroadcastAlert}
              >
                <Icon name="Megaphone" size={24} />
              </Button>
            )}
            <Button
              variant="default"
              size="icon"
              className="w-14 h-14 rounded-full shadow-medium"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon name="Filter" size={24} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPoweredDonorMatching;