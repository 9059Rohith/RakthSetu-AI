import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { patientService } from '../../services/patientService';
import Button from '../../components/ui/Button';
import { 
  Heart, 
  Calendar, 
  Bell, 
  AlertTriangle, 
  Clock, 
  Activity,
  Plus,
  Phone,
  MapPin,
  Droplet
} from 'lucide-react';

export default function PatientDashboard() {
  const { user, userProfile } = useAuth()
  const [patientProfile, setPatientProfile] = useState(null)
  const [bloodRequests, setBloodRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [nextTransfusion, setNextTransfusion] = useState(null)

  useEffect(() => {
    loadPatientData()
  }, [user])

  const loadPatientData = async () => {
    if (!user) return

    try {
      // Load all patient data concurrently
      const [profileRes, requestsRes, notificationsRes, predictionRes] = await Promise.allSettled([
        patientService?.getPatientProfile(),
        patientService?.getBloodRequests(),
        patientService?.getNotifications(),
        patientService?.getNextTransfusionPrediction()
      ])

      if (profileRes?.status === 'fulfilled') {
        setPatientProfile(profileRes?.value)
      }

      if (requestsRes?.status === 'fulfilled') {
        setBloodRequests(requestsRes?.value)
      }

      if (notificationsRes?.status === 'fulfilled') {
        setNotifications(notificationsRes?.value)
      }

      if (predictionRes?.status === 'fulfilled') {
        setNextTransfusion(predictionRes?.value)
      }

    } catch (error) {
      console.error('Error loading patient data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysUntilTransfusion = () => {
    if (!nextTransfusion) return null
    const today = new Date()
    const transfusionDate = new Date(nextTransfusion)
    const diffTime = transfusionDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'urgent': return 'text-orange-600 bg-orange-100'
      case 'routine': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      case 'matched': return 'text-purple-600 bg-purple-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

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

  const daysUntilTransfusion = getDaysUntilTransfusion()
  const unreadNotifications = notifications?.filter(n => !n?.is_read)?.length || 0

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
                  Welcome, {userProfile?.full_name || user?.email}
                </h1>
                <p className="text-gray-600">Patient Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Request Blood
              </Button>
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-500" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Critical Alert - Next Transfusion */}
        {daysUntilTransfusion !== null && daysUntilTransfusion <= 7 && (
          <div className="mb-6 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 mr-4" />
              <div>
                <h2 className="text-2xl font-bold">
                  Next Transfusion: {daysUntilTransfusion} Days
                </h2>
                <p className="mt-1 opacity-90">
                  {nextTransfusion ? new Date(nextTransfusion)?.toLocaleDateString() : 'Date not set'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Droplet className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Blood Type</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientProfile?.blood_type || 'Not Set'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last Transfusion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientProfile?.last_transfusion_date 
                    ? new Date(patientProfile.last_transfusion_date)?.toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Condition</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {patientProfile?.current_condition || 'Stable'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Frequency</p>
                <p className="text-2xl font-bold text-gray-900">
                  {patientProfile?.transfusion_frequency_days || 21} days
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blood Requests */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Blood Requests</h2>
            </div>
            <div className="p-6">
              {bloodRequests?.length > 0 ? (
                <div className="space-y-4">
                  {bloodRequests?.slice(0, 5)?.map((request) => (
                    <div key={request?.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request?.urgency_level)}`}>
                            {request?.urgency_level}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request?.status)}`}>
                            {request?.status}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(request.created_at)?.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{request?.blood_type} - {request?.units_needed} unit(s)</p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {request?.hospital?.name || 'Hospital not assigned'}
                          </p>
                        </div>
                        {request?.matched_donor && (
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">Donor Matched</p>
                            <p className="text-xs text-gray-500">
                              Score: {request?.ai_match_score}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No blood requests yet</p>
                  <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                    Create First Request
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
            </div>
            <div className="p-6">
              {notifications?.length > 0 ? (
                <div className="space-y-4">
                  {notifications?.slice(0, 5)?.map((notification) => (
                    <div 
                      key={notification?.id} 
                      className={`p-4 rounded-lg border ${!notification?.is_read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{notification?.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification?.message}</p>
                        </div>
                        {!notification?.is_read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.created_at)?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        {patientProfile && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Emergency Contact</h3>
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">{patientProfile?.emergency_contact_name}</p>
                <p className="text-red-700">{patientProfile?.emergency_contact_phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}