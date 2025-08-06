import React, { useState, useEffect } from 'react';
import { aiMatchingService } from '../../services/aiMatchingService';
import { patientService } from '../../services/patientService';
import Button from '../../components/ui/Button';
import { 
  Brain, 
  Users, 
  MapPin, 
  Clock, 
  Star,
  Activity,
  Droplet,
  Target,
  Zap,
  TrendingUp,
  Play,
  CheckCircle
} from 'lucide-react';

export default function AIMatchingDemo() {
  const [bloodRequests, setBloodRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [matchingResults, setMatchingResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [matchingStats, setMatchingStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [requestsRes, statsRes] = await Promise.allSettled([
        patientService?.getBloodRequests(),
        aiMatchingService?.getMatchingStats()
      ])

      if (requestsRes?.status === 'fulfilled') {
        setBloodRequests(requestsRes?.value)
        // Auto-select first pending request
        const pendingRequest = requestsRes?.value?.find(r => r?.status === 'pending')
        if (pendingRequest) {
          setSelectedRequest(pendingRequest)
        }
      }

      if (statsRes?.status === 'fulfilled') {
        setMatchingStats(statsRes?.value)
      }

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runAIMatching = async () => {
    if (!selectedRequest) return

    setIsRunning(true)
    setMatchingResults([])

    try {
      const results = await aiMatchingService?.runAIMatching(selectedRequest?.id)
      
      if (results?.matches) {
        // Simulate AI processing animation
        for (let i = 0; i < results?.matches?.length; i++) {
          setTimeout(() => {
            setMatchingResults(prev => [...prev, results?.matches?.[i]])
          }, (i + 1) * 500)
        }
      }

      // Update stats after matching
      setTimeout(async () => {
        const updatedStats = await aiMatchingService?.getMatchingStats()
        setMatchingStats(updatedStats)
        setIsRunning(false)
      }, results?.matches?.length * 500 + 1000)

    } catch (error) {
      console.error('Error running AI matching:', error)
      setIsRunning(false)
    }
  }

  const selectBestMatch = async (donorId) => {
    try {
      await aiMatchingService?.selectBestMatch(selectedRequest?.id, donorId)
      // Reload data to show updated status
      loadData()
      setMatchingResults([])
    } catch (error) {
      console.error('Error selecting match:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading AI Matching Demo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-16 w-16" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              RaktaSetu AI Matching Engine
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Graph Neural Network powered donor-patient matching with 30+ optimization factors
            </p>
            
            {/* AI Stats */}
            {matchingStats && (
              <div className="flex justify-center space-x-8 text-center">
                <div>
                  <p className="text-3xl font-bold">{matchingStats?.successRate}%</p>
                  <p className="text-sm opacity-80">Success Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{matchingStats?.averageScore}</p>
                  <p className="text-sm opacity-80">Avg Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{matchingStats?.totalMatches}</p>
                  <p className="text-sm opacity-80">Total Matches</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Selection */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Select Blood Request</h2>
            </div>
            <div className="p-6">
              {bloodRequests?.length > 0 ? (
                <div className="space-y-4">
                  {bloodRequests?.filter(r => r?.status === 'pending' || r?.status === 'matched')?.map((request) => (
                    <div 
                      key={request?.id} 
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedRequest?.id === request?.id 
                          ? 'border-purple-500 bg-purple-50' :'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request?.urgency_level)}`}>
                          {request?.urgency_level}
                        </span>
                        <span className="text-sm text-gray-500">
                          {request?.blood_type}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Droplet className="h-4 w-4 text-red-500" />
                          <span className="font-medium">
                            {request?.units_needed} unit(s) needed
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {request?.hospital?.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Required: {new Date(request.required_date)?.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No pending requests available
                </p>
              )}
            </div>
          </div>

          {/* AI Matching Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">AI Matching Results</h2>
                <Button
                  onClick={runAIMatching}
                  disabled={!selectedRequest || isRunning}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isRunning ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run AI Matching
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedRequest ? (
                <div>
                  {/* Selected Request Info */}
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">
                      Matching for: {selectedRequest?.blood_type} Blood Request
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-purple-700">Urgency:</span>
                        <p className="text-purple-900 capitalize">{selectedRequest?.urgency_level}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700">Units:</span>
                        <p className="text-purple-900">{selectedRequest?.units_needed}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700">Hospital:</span>
                        <p className="text-purple-900">{selectedRequest?.hospital?.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-700">Date:</span>
                        <p className="text-purple-900">
                          {new Date(selectedRequest.required_date)?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Matching Results */}
                  {matchingResults?.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Target className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold text-gray-900">
                          Found {matchingResults?.length} Optimal Matches
                        </h3>
                      </div>
                      
                      {matchingResults?.map((match, index) => (
                        <div 
                          key={index} 
                          className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {match?.donor?.user?.full_name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {match?.donor?.blood_type} Donor
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-lg font-bold text-green-600">
                                  {match?.matchScore}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">Match Score</p>
                            </div>
                          </div>

                          {/* Matching Factors */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <Droplet className="h-4 w-4 text-red-500 mx-auto mb-1" />
                              <p className="font-medium">Blood Match</p>
                              <p className="text-green-600">100%</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <MapPin className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                              <p className="font-medium">Distance</p>
                              <p className="text-blue-600">{match?.distance} km</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <Clock className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                              <p className="font-medium">Travel Time</p>
                              <p className="text-orange-600">{match?.travelTime} min</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <TrendingUp className="h-4 w-4 text-green-500 mx-auto mb-1" />
                              <p className="font-medium">Reliability</p>
                              <p className="text-green-600">
                                {(match?.donor?.reliability_score * 100)?.toFixed(0)}%
                              </p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Contact:</span> {match?.donor?.user?.phone || 'Not available'}
                            </div>
                            <Button
                              onClick={() => selectBestMatch(match?.donor?.id)}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Select This Donor
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isRunning ? (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <Zap className="h-12 w-12 text-purple-500 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        AI Graph Neural Network Processing...
                      </h3>
                      <p className="text-gray-600">
                        Analyzing 30+ factors including blood compatibility, distance, traffic, donor reliability, and availability patterns
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <Brain className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ready to Run AI Matching
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Our Graph Neural Network will analyze this request against all available donors
                      </p>
                      <Button
                        onClick={runAIMatching}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start AI Analysis
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Select a blood request to run AI matching
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Technology Showcase */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              How RaktaSetu AI Works
            </h2>
            <p className="text-gray-600">
              Our Graph Neural Network considers 30+ variables for optimal donor-patient matching
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Medical Compatibility</h3>
              <p className="text-sm text-gray-600">
                Blood type matching, antigen compatibility, and medical history analysis for Thalassemia patients
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Geographic Optimization</h3>
              <p className="text-sm text-gray-600">
                Real-time traffic analysis, distance calculation, and hospital processing times
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reliability Scoring</h3>
              <p className="text-sm text-gray-600">
                Donor history, availability patterns, and prediction of successful donation completion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}