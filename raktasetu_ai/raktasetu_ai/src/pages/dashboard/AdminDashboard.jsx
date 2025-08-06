import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { hospitalService } from '../../services/hospitalService';
import { aiMatchingService } from '../../services/aiMatchingService';
import { donorService } from '../../services/donorService';
import Button from '../../components/ui/Button';
import { Heart, Users, Activity, TrendingUp, MapPin, Droplet, Clock, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, userProfile } = useAuth()
  const [hospitals, setHospitals] = useState([])
  const [emergencyRequests, setEmergencyRequests] = useState([])
  const [availableDonors, setAvailableDonors] = useState([])
  const [matchingStats, setMatchingStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('Coimbatore')

  useEffect(() => {
    loadAdminData()
  }, [user, selectedCity])

  const loadAdminData = async () => {
    if (!user) return

    try {
      const [hospitalsRes, emergencyRes, donorsRes, statsRes] = await Promise.allSettled([
        hospitalService?.getHospitalsByCity(selectedCity),
        hospitalService?.getEmergencyRequests(selectedCity),
        donorService?.getAvailableDonors(),
        aiMatchingService?.getMatchingStats()
      ])

      if (hospitalsRes?.status === 'fulfilled') {
        setHospitals(hospitalsRes?.value)
      }

      if (emergencyRes?.status === 'fulfilled') {
        setEmergencyRequests(emergencyRes?.value)
      }

      if (donorsRes?.status === 'fulfilled') {
        setAvailableDonors(donorsRes?.value)
      }

      if (statsRes?.status === 'fulfilled') {
        setMatchingStats(statsRes?.value)
      }

    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  
  const getDonorCountByBloodType = (bloodType) => {
    return availableDonors?.filter(donor => donor?.blood_type === bloodType)?.length || 0;
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'urgent': return 'text-orange-600 bg-orange-100'
      case 'routine': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const runAIMatchingForRequest = async (requestId) => {
    try {
      const results = await aiMatchingService?.runAIMatching(requestId)
      console.log('AI Matching Results:', results)
      // Refresh emergency requests to show updated status
      loadAdminData()
    } catch (error) {
      console.error('Error running AI matching:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  RaktaSetu AI Admin
                </h1>
                <p className="text-gray-600">System Overview & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e?.target?.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="Coimbatore">Coimbatore</option>
                <option value="Chennai">Chennai</option>
                <option value="Madurai">Madurai</option>
                <option value="Trichy">Trichy</option>
              </select>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available Donors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {availableDonors?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Partner Hospitals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hospitals?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Emergency Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {emergencyRequests?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {matchingStats?.successRate || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blood Type Availability */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Blood Type Availability</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {bloodTypes?.map((type) => {
                  const count = getDonorCountByBloodType(type)
                  const isLow = count < 2
                  return (
                    <div key={type} className={`p-4 rounded-lg border ${isLow ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Droplet className={`h-5 w-5 ${isLow ? 'text-red-500' : 'text-gray-500'}`} />
                          <span className="font-medium">{type}</span>
                        </div>
                        <span className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                          {count}
                        </span>
                      </div>
                      {isLow && (
                        <p className="text-xs text-red-600 mt-1">Low availability</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Emergency Requests */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Emergency Blood Requests</h2>
            </div>
            <div className="p-6">
              {emergencyRequests?.length > 0 ? (
                <div className="space-y-4">
                  {emergencyRequests?.map((request) => (
                    <div key={request?.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <span className="font-semibold text-red-900">
                            {request?.blood_type} - {request?.units_needed} unit(s)
                          </span>
                        </div>
                        <span className="text-sm text-red-600">
                          {request?.critical_window_hours}h window
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Patient: {request?.patient?.user?.full_name || 'Anonymous'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {request?.hospital?.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Requested: {new Date(request.created_at)?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => runAIMatchingForRequest(request?.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4"
                        >
                          <Activity className="h-4 w-4 mr-1" />
                          Run AI Matching
                        </Button>
                        <Button
                          variant="outline"
                          className="text-sm py-2 px-4"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No emergency requests at this time</p>
                  <p className="text-sm text-gray-400 mt-1">
                    All blood requests are being handled normally
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hospital Network */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Partner Hospitals in {selectedCity}</h2>
          </div>
          <div className="p-6">
            {hospitals?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospitals?.map((hospital) => (
                  <div key={hospital?.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{hospital?.name}</h3>
                      {hospital?.has_thalassemia_center && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Thalassemia Center
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{hospital?.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span>
                          Capacity: {hospital?.blood_bank_capacity} units
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Processing: {hospital?.processing_time_hours}h
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <Button
                        variant="outline"
                        className="flex-1 text-sm py-2"
                      >
                        View Inventory
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-sm py-2"
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hospitals found in {selectedCity}</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Matching Statistics */}
        {matchingStats && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Matching Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{matchingStats?.totalMatches}</p>
                <p className="text-sm text-gray-500">Total Matches Run</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{matchingStats?.successfulMatches}</p>
                <p className="text-sm text-gray-500">Successful Matches</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{matchingStats?.successRate}%</p>
                <p className="text-sm text-gray-500">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{matchingStats?.averageScore}</p>
                <p className="text-sm text-gray-500">Average Match Score</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}