import { supabase } from '../lib/supabase';

export const aiMatchingService = {
  // Get AI matching results for a blood request
  async getMatchingResults(requestId) {
    try {
      const { data, error } = await supabase?.from('ai_matching_history')?.select(`
          *,
          donor:donors(
            id,
            blood_type,
            reliability_score,
            location_city,
            user:user_profiles(full_name, phone)
          )
        `)?.eq('request_id', requestId)?.order('match_score', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching matching results:', error)
      throw error
    }
  },

  // Simulate AI matching algorithm
  async runAIMatching(requestId) {
    try {
      // Get blood request details
      const { data: request, error: requestError } = await supabase?.from('blood_requests')?.select(`
          *,
          patient:patients(
            *,
            user:user_profiles(full_name)
          ),
          hospital:hospitals(*)
        `)?.eq('id', requestId)?.single()

      if (requestError) {
        throw new Error(requestError.message)
      }

      // Get available donors with matching blood type
      const { data: donors, error: donorsError } = await supabase?.from('donors')?.select(`
          *,
          user:user_profiles(full_name, phone)
        `)?.eq('blood_type', request?.blood_type)?.eq('is_available', true)

      if (donorsError) {
        throw new Error(donorsError.message)
      }

      if (!donors || donors?.length === 0) {
        return { matches: [], message: 'No available donors found for this blood type' }
      }

      // Calculate matching scores for each donor
      const matches = await Promise.all(donors?.map(async (donor) => {
        const matchScore = await this.calculateMatchScore(request, donor)
        
        // Store matching history
        const { error: historyError } = await supabase?.from('ai_matching_history')?.insert([{
            request_id: requestId,
            donor_id: donor?.id,
            match_score: matchScore?.totalScore,
            factors_considered: matchScore?.factors,
            distance_km: matchScore?.distance,
            travel_time_minutes: matchScore?.travelTime,
            compatibility_score: matchScore?.compatibility,
            availability_score: matchScore?.availability,
            reliability_score: matchScore?.reliability
          }])

        if (historyError) {
          console.error('Error storing matching history:', historyError)
        }

        return {
          donor,
          matchScore: matchScore?.totalScore,
          factors: matchScore?.factors,
          distance: matchScore?.distance,
          travelTime: matchScore?.travelTime
        };
      }))

      // Sort by match score (highest first)
      matches?.sort((a, b) => b?.matchScore - a?.matchScore)

      return { matches, message: `Found ${matches?.length} potential donors` };
    } catch (error) {
      console.error('Error running AI matching:', error)
      throw error
    }
  },

  // Calculate match score for a donor-request pair
  async calculateMatchScore(request, donor) {
    try {
      // Blood compatibility score (100% for exact match)
      const compatibilityScore = request?.blood_type === donor?.blood_type ? 1.0 : 0.0
      
      // Calculate distance (simulated - in real app would use actual coordinates)
      const distance = this.calculateDistance(
        request?.hospital?.latitude || 11.0168,
        request?.hospital?.longitude || 76.9558,
        11.0168 + (Math.random() - 0.5) * 0.2, // Simulated donor coordinates
        76.9558 + (Math.random() - 0.5) * 0.2
      )

      // Distance score (closer is better, max 50km)
      const distanceScore = Math.max(0, (50 - distance) / 50)

      // Availability score (always 1.0 since we filtered for available donors)
      const availabilityScore = donor?.is_available ? 1.0 : 0.0

      // Reliability score from donor profile
      const reliabilityScore = donor?.reliability_score || 1.0

      // Urgency multiplier
      const urgencyMultiplier = {
        'critical': 1.5,
        'urgent': 1.2,
        'routine': 1.0
      }?.[request?.urgency_level] || 1.0

      // Calculate weighted total score
      const totalScore = (
        (// Reliability (20%)
        compatibilityScore * 40 +    // Blood compatibility (40%)
        distanceScore * 25 +         // Distance (25%)
        reliabilityScore * 20 + availabilityScore * 15)       // Availability (15%)
      ) * urgencyMultiplier

      // Travel time estimation (rough calculation)
      const travelTime = Math.max(15, Math.round(distance * 2.5)) // Approx 2.5 min per km

      return {
        totalScore: Math.round(totalScore * 100) / 100,
        compatibility: compatibilityScore,
        distance: Math.round(distance * 100) / 100,
        availability: availabilityScore,
        reliability: reliabilityScore,
        travelTime,
        factors: {
          blood_compatibility: compatibilityScore,
          distance_score: distanceScore,
          reliability: reliabilityScore,
          availability: availabilityScore,
          urgency_multiplier: urgencyMultiplier
        }
      }
    } catch (error) {
      console.error('Error calculating match score:', error)
      return {
        totalScore: 0,
        compatibility: 0,
        distance: 0,
        availability: 0,
        reliability: 0,
        travelTime: 0,
        factors: {}
      }
    }
  },

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const d = R * c // Distance in km
    return d
  },

  deg2rad(deg) {
    return deg * (Math.PI/180)
  },

  // Get matching statistics
  async getMatchingStats() {
    try {
      const { data: stats, error } = await supabase?.from('ai_matching_history')?.select('match_score, is_selected, created_at')?.order('created_at', { ascending: false })?.limit(1000)

      if (error) {
        throw new Error(error.message)
      }

      const totalMatches = stats?.length || 0
      const successfulMatches = stats?.filter(s => s?.is_selected)?.length || 0
      const averageScore = totalMatches > 0 
        ? stats?.reduce((sum, s) => sum + s?.match_score, 0) / totalMatches 
        : 0

      const successRate = totalMatches > 0 ? (successfulMatches / totalMatches) * 100 : 0

      return {
        totalMatches,
        successfulMatches,
        successRate: Math.round(successRate * 100) / 100,
        averageScore: Math.round(averageScore * 100) / 100
      }
    } catch (error) {
      console.error('Error fetching matching stats:', error)
      throw error
    }
  },

  // Select best match for a request
  async selectBestMatch(requestId, donorId) {
    try {
      // Update matching history to mark selection
      const { error: historyError } = await supabase?.from('ai_matching_history')?.update({ is_selected: true })?.eq('request_id', requestId)?.eq('donor_id', donorId)

      if (historyError) {
        throw new Error(historyError.message)
      }

      // Update blood request with matched donor
      const { data, error } = await supabase?.from('blood_requests')?.update({
          status: 'matched',
          matched_donor_id: donorId
        })?.eq('id', requestId)?.select()?.single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Error selecting best match:', error)
      throw error
    }
  }
}