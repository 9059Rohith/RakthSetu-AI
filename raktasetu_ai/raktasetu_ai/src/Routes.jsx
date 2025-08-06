import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
 import ErrorBoundary from'./components/ErrorBoundary';
 import ScrollToTop from'./components/ScrollToTop';
 

// Page imports
import NotFound from './pages/NotFound';
 import Dashboard from'./pages/dashboard';
 import PatientCaregiverDashboard from'./pages/patient-caregiver-dashboard';
 import BloodDonorRegistrationProfile from'./pages/blood-donor-registration-profile';
 import AIPoweredDonorMatching from'./pages/ai-powered-donor-matching';
 import RealTimeDonorAvailabilityTracking from'./pages/real-time-donor-availability-tracking';
 import HospitalAdministratorDashboard from'./pages/hospital-administrator-dashboard';
 import EmergencyBloodRequestSystem from'./pages/emergency-blood-request-system';

// New authentication pages
import Login from './pages/authentication/Login';
 import Signup from'./pages/authentication/Signup';
 import AIMatchingDemo from'./pages/ai-matching/AIMatchingDemo';

function Routes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Dashboard Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Feature Routes */}
            <Route path="/patient-dashboard" element={<PatientCaregiverDashboard />} />
            <Route path="/donor-profile" element={<BloodDonorRegistrationProfile />} />
            <Route path="/ai-matching" element={<AIPoweredDonorMatching />} />
            <Route path="/ai-matching-demo" element={<AIMatchingDemo />} />
            <Route path="/tracking" element={<RealTimeDonorAvailabilityTracking />} />
            <Route path="/hospital-admin" element={<HospitalAdministratorDashboard />} />
            <Route path="/emergency" element={<EmergencyBloodRequestSystem />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Routes