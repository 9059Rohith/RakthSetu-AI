import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { donorService } from '../../services/donorService';
import Button from '../../components/ui/Button';
import { 
  Heart, 
  Calendar, 
  Award, 
  MapPin, 
  Clock, 
  Activity,
  Droplet,
  Phone,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';

export default function DonorDashboard() {
  const { user, userProfile } = useAuth()
  const [donorProfile, setDonorProfile] = useState(null)
  const [donationHistory, setDonationHistory] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [donorStats, setDonorStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDonorData()
  }, [user])

  const loadDonorData = async () => {
    if (!user) return

    try {
      const [profileRes, historyRes, requestsRes, statsRes] = await Promise.allSettled([
        donorService?.getDonorProfile(),
        donorService?.getDonationHistory(),
        donorService?.getPendingRequests(),
        donorService?.getDonorStats()
      ])

      if (profileRes?.status === 'fulfilled') {
        setDonorProfile(profileRes?.value)
      }

      if (historyRes?.status === 'fulfilled') {
        setDonationHistory(historyRes?.value)
      }

      if (requestsRes?.status === 'fulfilled') {
        setPendingRequests(requestsRes?.value)
      }

      if (statsRes?.status === 'fulfilled') {
        setDonorStats(statsRes?.value)
      }

    } catch (error) {
      console.error('Error loading donor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async () => {
    try {
      const newAvailability = !donorProfile?.is_available
      const updatedProfile = await donorService?.updateAvailability(newAvailability)
      setDonorProfile(updatedProfile)
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      const donationDate = new Date()
      donationDate?.setDate(donationDate?.getDate() + 1) // Schedule for tomorrow
      
      await donorService?.acceptDonationRequest(requestId, donationDate?.toISOString()?.split('T')?.[0])
      
      // Reload data
      loadDonorData()
    } catch (error) {
      console.error('Error accepting request:', error)
    }
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
      case 'cancelled': return 'text-red-600 bg-red-100'
      case 'no_show': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const isEligibleToDonate = () => {
    if (!donorStats?.lastDonation) return true
    const lastDonationDate = new Date(donorStats.lastDonation)
    const today = new Date()
    const daysSinceLastDonation = Math.floor((today - lastDonationDate) / (1000 * 60 * 60 * 24))
    return daysSinceLastDonation >= 90 // 90 days minimum gap
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
                <p className="text-gray-600">Blood Donor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleToggleAvailability}
                className={`${
                  donorProfile?.is_available 
                    ? 'bg-green-600 hover:bg-green-700' :'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {donorProfile?.is_available ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Available
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Unavailable
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Eligibility Alert */}
        {!isEligibleToDonate() && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-500 mr-4" />
              <div>
                <h2 className="text-lg font-semibold text-yellow-800">
                  Donation Eligibility Period
                </h2>
                <p className="mt-1 text-yellow-700">
                  You can donate again after {donorStats?.nextEligibleDate ? new Date(donorStats.nextEligibleDate)?.toLocaleDateString() : 'your next eligible date'}
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
                  {donorProfile?.blood_type || 'Not Set'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-gold-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {donorStats?.totalDonations || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reliability Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {donorStats?.reliabilityScore ? (donorStats?.reliabilityScore * 100)?.toFixed(0) + '%' : 'New'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last Donation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {donorStats?.lastDonation 
                    ? new Date(donorStats.lastDonation)?.toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Donation Requests */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pending Donation Requests</h2>
            </div>
            <div className="p-6">
              {pendingRequests?.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests?.slice(0, 5)?.map((request) => (
                    <div key={request?.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request?.urgency_level)}`}>
                          {request?.urgency_level}
                        </span>
                        <span className="text-sm text-gray-500">
                          Required: {new Date(request.required_date)?.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {request?.patient?.user?.full_name || 'Patient'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Droplet className="h-4 w-4 text-red-500" />
                          <span>{request?.blood_type} - {request?.units_needed} unit(s)</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {request?.hospital?.name}, {request?.hospital?.city}
                          </span>
                        </div>

                        {request?.patient?.emergency_contact_phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {request?.patient?.emergency_contact_name}: {request?.patient?.emergency_contact_phone}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button
                          onClick={() => handleAcceptRequest(request?.id)}
                          disabled={!isEligibleToDonate() || !donorProfile?.is_available}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-sm py-2"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pending donation requests</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {donorProfile?.is_available 
                      ? 'You will be notified when someone needs your blood type'
                      : 'Update your availability to receive requests'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Donation History */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
            </div>
            <div className="p-6">
              {donationHistory?.length > 0 ? (
                <div className="space-y-4">
                  {donationHistory?.slice(0, 5)?.map((donation) => (
                    <div key={donation?.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation?.status)}`}>
                          {donation?.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(donation.donation_date)?.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            {donation?.hospital?.name}
                          </span>
                        </div>
                        
                        {donation?.request?.patient?.user?.full_name && (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              For: {donation?.request?.patient?.user?.full_name}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Droplet className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-600">
                            {donation?.units_donated} unit(s) donated
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No donation history yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your donation history will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Donor Profile Summary */}
        {donorProfile && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="mt-1 text-sm text-gray-900">
                  {donorProfile?.location_city}, {donorProfile?.location_state}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Preferred Time</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {donorProfile?.preferred_donation_time}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Coverage Radius</p>
                <p className="mt-1 text-sm text-gray-900">
                  {donorProfile?.availability_radius_km} km
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}