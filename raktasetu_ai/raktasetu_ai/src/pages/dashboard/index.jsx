import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
 import PatientDashboard from'./PatientDashboard';
 import DonorDashboard from'./DonorDashboard';
 import AdminDashboard from'./AdminDashboard';
import { Heart } from 'lucide-react';

export default function Dashboard() {
  const { user, userProfile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to RaktaSetu AI
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your dashboard
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Route to appropriate dashboard based on user role
  const userRole = userProfile?.role || 'patient'

  switch (userRole) {
    case 'admin': case'hospital_admin':
      return <AdminDashboard />
    case 'donor':
      return <DonorDashboard />
    case 'patient': case'caregiver': case'doctor':
    default:
      return <PatientDashboard />
  }
}