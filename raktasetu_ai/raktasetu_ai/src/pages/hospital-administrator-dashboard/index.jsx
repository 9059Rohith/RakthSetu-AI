import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import PatientManagementTable from './components/PatientManagementTable';
import DonorAvailabilityFeed from './components/DonorAvailabilityFeed';
import InventoryChart from './components/InventoryChart';
import QuickActions from './components/QuickActions';
import ComplianceTracker from './components/ComplianceTracker';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const HospitalAdministratorDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Mock data for dashboard metrics
  const metricsData = [
    {
      title: "Total Blood Units",
      value: "1,247",
      subtitle: "Available in inventory",
      icon: "Droplets",
      trend: "up",
      trendValue: "+12%",
      alertLevel: "normal"
    },
    {
      title: "Pending Transfusions",
      value: "23",
      subtitle: "Scheduled for today",
      icon: "Clock",
      trend: "down",
      trendValue: "-5%",
      alertLevel: "warning"
    },
    {
      title: "Active Donors",
      value: "156",
      subtitle: "Available this week",
      icon: "Users",
      trend: "up",
      trendValue: "+8%",
      alertLevel: "success"
    },
    {
      title: "Critical Shortage",
      value: "3",
      subtitle: "Blood types below minimum",
      icon: "AlertTriangle",
      trend: "up",
      trendValue: "+2",
      alertLevel: "critical"
    }
  ];

  // Mock patient data
  const patientsData = [
    {
      id: "P001",
      name: "Rajesh Kumar",
      patientId: "TH2024001",
      bloodType: "B+",
      nextTransfusion: "Dec 8, 2024",
      timeRemaining: "2 days",
      assignedDonor: "Priya Sharma",
      status: "scheduled",
      urgency: "medium"
    },
    {
      id: "P002",
      name: "Meera Patel",
      patientId: "TH2024002",
      bloodType: "O-",
      nextTransfusion: "Dec 6, 2024",
      timeRemaining: "Today",
      assignedDonor: null,
      status: "pending",
      urgency: "critical"
    },
    {
      id: "P003",
      name: "Arjun Singh",
      patientId: "TH2024003",
      bloodType: "A+",
      nextTransfusion: "Dec 10, 2024",
      timeRemaining: "4 days",
      assignedDonor: "Kavya Reddy",
      status: "scheduled",
      urgency: "low"
    },
    {
      id: "P004",
      name: "Lakshmi Nair",
      patientId: "TH2024004",
      bloodType: "AB-",
      nextTransfusion: "Dec 7, 2024",
      timeRemaining: "1 day",
      assignedDonor: "Ravi Kumar",
      status: "scheduled",
      urgency: "high"
    },
    {
      id: "P005",
      name: "Suresh Babu",
      patientId: "TH2024005",
      bloodType: "B-",
      nextTransfusion: "Dec 5, 2024",
      timeRemaining: "Overdue",
      assignedDonor: null,
      status: "overdue",
      urgency: "critical"
    }
  ];

  // Mock donor data
  const donorsData = [
    {
      id: "D001",
      name: "Priya Sharma",
      bloodType: "B+",
      availability: "available",
      distance: "2.3 km",
      lastDonation: "45 days ago",
      compatibilityScore: 95,
      rating: 5,
      totalDonations: 12
    },
    {
      id: "D002",
      name: "Vikram Joshi",
      bloodType: "O-",
      availability: "available",
      distance: "1.8 km",
      lastDonation: "62 days ago",
      compatibilityScore: 98,
      rating: 5,
      totalDonations: 18
    },
    {
      id: "D003",
      name: "Kavya Reddy",
      bloodType: "A+",
      availability: "busy",
      distance: "3.1 km",
      lastDonation: "38 days ago",
      compatibilityScore: 87,
      rating: 4,
      totalDonations: 8
    },
    {
      id: "D004",
      name: "Ravi Kumar",
      bloodType: "AB-",
      availability: "available",
      distance: "4.2 km",
      lastDonation: "71 days ago",
      compatibilityScore: 92,
      rating: 5,
      totalDonations: 15
    },
    {
      id: "D005",
      name: "Anita Gupta",
      bloodType: "O+",
      availability: "unavailable",
      distance: "2.7 km",
      lastDonation: "29 days ago",
      compatibilityScore: 89,
      rating: 4,
      totalDonations: 6
    }
  ];

  // Mock inventory data
  const inventoryData = [
    { bloodType: 'A+', current: 145, minimum: 100 },
    { bloodType: 'A-', current: 78, minimum: 80 },
    { bloodType: 'B+', current: 132, minimum: 90 },
    { bloodType: 'B-', current: 45, minimum: 60 },
    { bloodType: 'AB+', current: 67, minimum: 50 },
    { bloodType: 'AB-', current: 23, minimum: 30 },
    { bloodType: 'O+', current: 189, minimum: 120 },
    { bloodType: 'O-', current: 34, minimum: 70 }
  ];

  const expirationData = [
    { date: 'Dec 6', expiring: 12, critical: 5 },
    { date: 'Dec 7', expiring: 8, critical: 3 },
    { date: 'Dec 8', expiring: 15, critical: 7 },
    { date: 'Dec 9', expiring: 6, critical: 2 },
    { date: 'Dec 10', expiring: 11, critical: 4 },
    { date: 'Dec 11', expiring: 9, critical: 1 },
    { date: 'Dec 12', expiring: 13, critical: 6 }
  ];

  const usageData = {
    weekly: [
      { day: 'Mon', used: 45 },
      { day: 'Tue', used: 32 },
      { day: 'Wed', used: 38 },
      { day: 'Thu', used: 41 },
      { day: 'Fri', used: 52 },
      { day: 'Sat', used: 28 },
      { day: 'Sun', used: 25 }
    ],
    distribution: [
      { bloodType: 'O+', percentage: 28 },
      { bloodType: 'A+', percentage: 22 },
      { bloodType: 'B+', percentage: 18 },
      { bloodType: 'AB+', percentage: 12 },
      { bloodType: 'O-', percentage: 8 },
      { bloodType: 'A-', percentage: 6 },
      { bloodType: 'B-', percentage: 4 },
      { bloodType: 'AB-', percentage: 2 }
    ]
  };

  // Mock compliance data
  const complianceData = {
    overall: {
      percentage: 87,
      status: "Good Standing",
      lastUpdated: "Dec 5, 2024"
    },
    categories: [
      {
        id: "data-privacy",
        name: "Data Privacy (DPDP Act)",
        description: "Personal data protection compliance",
        percentage: 92,
        completedItems: 23,
        totalItems: 25,
        status: "compliant",
        recentIssues: []
      },
      {
        id: "medical-standards",
        name: "Medical Standards",
        description: "Clinical protocols and safety standards",
        percentage: 88,
        completedItems: 44,
        totalItems: 50,
        status: "compliant",
        recentIssues: ["Missing documentation for 2 procedures"]
      },
      {
        id: "blood-safety",
        name: "Blood Safety Protocols",
        description: "Testing and storage compliance",
        percentage: 95,
        completedItems: 38,
        totalItems: 40,
        status: "compliant",
        recentIssues: []
      },
      {
        id: "donor-consent",
        name: "Donor Consent Management",
        description: "Consent tracking and documentation",
        percentage: 76,
        completedItems: 19,
        totalItems: 25,
        status: "warning",
        recentIssues: ["6 donors missing updated consent forms"]
      }
    ],
    auditTrail: [
      {
        action: "Compliance report generated",
        user: "Dr. Rajesh Kumar",
        timestamp: "2 hours ago",
        type: "compliance"
      },
      {
        action: "Data privacy policy updated",
        user: "Admin Team",
        timestamp: "1 day ago",
        type: "compliance"
      },
      {
        action: "Warning issued for missing consent",
        user: "System",
        timestamp: "2 days ago",
        type: "warning"
      }
    ],
    upcomingDeadlines: [
      {
        task: "Quarterly Compliance Review",
        description: "Submit Q4 compliance documentation",
        dueDate: "Dec 31, 2024",
        daysLeft: 25
      },
      {
        task: "Blood Safety Audit",
        description: "External audit by regulatory body",
        dueDate: "Jan 15, 2025",
        daysLeft: 40
      }
    ]
  };

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleMetricClick = (metric) => {
    console.log('Metric clicked:', metric);
  };

  const handlePatientUpdate = (patientId) => {
    console.log('Update patient:', patientId);
  };

  const handleViewPatientDetails = (patientId) => {
    console.log('View patient details:', patientId);
  };

  const handleScheduleAppointment = (patientId) => {
    console.log('Schedule appointment for patient:', patientId);
  };

  const handleContactDonor = (donorId) => {
    console.log('Contact donor:', donorId);
  };

  const handleBulkNotify = (donorIds) => {
    console.log('Bulk notify donors:', donorIds);
  };

  const handleMatchDonor = (donorId) => {
    console.log('Match donor:', donorId);
  };

  const handleEmergencyRequest = (emergencyType) => {
    setEmergencyActive(true);
    console.log('Emergency request triggered:', emergencyType);
    // Auto-disable after 5 seconds for demo
    setTimeout(() => setEmergencyActive(false), 5000);
  };

  const handleExportData = () => {
    console.log('Export inventory data');
  };

  const handleGenerateReport = () => {
    console.log('Generate analytics report');
  };

  const handleExportAudit = () => {
    console.log('Export audit trail');
  };

  const handleViewComplianceDetails = (categoryId) => {
    console.log('View compliance details:', categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        userRole="admin"
        emergencyActive={emergencyActive}
        notificationCount={5}
        onEmergencyTrigger={() => handleEmergencyRequest('critical-shortage')}
      />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          userRole="admin"
          emergencyActive={emergencyActive}
          notificationCount={5}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onEmergencyTrigger={() => handleEmergencyRequest('critical-shortage')}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Hospital Administrator Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive blood inventory management and patient coordination
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-success/10 text-success rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">System Online</span>
                </div>
                
                <Button variant="outline" size="sm">
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData?.map((metric, index) => (
                <MetricsCard
                  key={index}
                  {...metric}
                  onClick={() => handleMetricClick(metric)}
                />
              ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Patient Management - Takes 2 columns */}
              <div className="xl:col-span-2">
                <PatientManagementTable
                  patients={patientsData}
                  onPatientUpdate={handlePatientUpdate}
                  onViewDetails={handleViewPatientDetails}
                  onScheduleAppointment={handleScheduleAppointment}
                />
              </div>

              {/* Donor Availability Feed - Takes 1 column */}
              <div className="xl:col-span-1">
                <DonorAvailabilityFeed
                  donors={donorsData}
                  onContactDonor={handleContactDonor}
                  onBulkNotify={handleBulkNotify}
                  onMatchDonor={handleMatchDonor}
                />
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Inventory Chart */}
              <div className="xl:col-span-1">
                <InventoryChart
                  inventoryData={inventoryData}
                  expirationData={expirationData}
                  usageData={usageData}
                  onExportData={handleExportData}
                />
              </div>

              {/* Quick Actions */}
              <div className="xl:col-span-1">
                <QuickActions
                  onEmergencyRequest={handleEmergencyRequest}
                  onBulkNotify={() => handleBulkNotify([])}
                  onScheduleAppointment={() => handleScheduleAppointment(null)}
                  onGenerateReport={handleGenerateReport}
                />
              </div>
            </div>

            {/* Compliance Tracker - Full Width */}
            <div className="w-full">
              <ComplianceTracker
                complianceData={complianceData}
                onExportAudit={handleExportAudit}
                onViewDetails={handleViewComplianceDetails}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HospitalAdministratorDashboard;