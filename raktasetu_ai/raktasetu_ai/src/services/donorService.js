import { supabase } from '../lib/supabase';

export const donorService = {
  // Get donor profile for authenticated user
  async getDonorProfile() {
    try {
      const { data, error } = await supabase?.from('donors')?.select(`
          *,
          user:user_profiles(id, full_name, email, phone)
        `)?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error fetching donor profile:', error)
      throw error
    }
  },

  // Create donor profile
  async createDonorProfile(donorData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase?.from('donors')?.insert([{
          user_id: user?.id,
          ...donorData
        }])?.select()?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error creating donor profile:', error)
      throw error
    }
  },

  // Update donor availability
  async updateAvailability(isAvailable) {
    try {
      const { data, error } = await supabase?.from('donors')?.update({ is_available: isAvailable })?.select()?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error updating availability:', error)
      throw error
    }
  },

  // Get available donors (for admin/matching)
  async getAvailableDonors(bloodType = null, city = null) {
    try {
      let query = supabase?.from('donors')?.select(`
          *,
          user:user_profiles(id, full_name, email, phone)
        `)?.eq('is_available', true)

      if (bloodType) {
        query = query?.eq('blood_type', bloodType)
      }

      if (city) {
        query = query?.eq('location_city', city)
      }

      const { data, error } = await query?.order('reliability_score', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching available donors:', error)
      throw error
    }
  },

  // Get donor's donations history
  async getDonationHistory() {
    try {
      const { data, error } = await supabase?.from('donations')?.select(`
          *,
          hospital:hospitals(id, name, city),
          request:blood_requests(
            id, 
            urgency_level,
            patient:patients(
              id,
              user:user_profiles(full_name)
            )
          )
        `)?.order('donation_date', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching donation history:', error)
      throw error
    }
  },

  // Get pending donation requests
  async getPendingRequests() {
    try {
      const donor = await this.getDonorProfile()
      if (!donor) return []

      const { data, error } = await supabase?.from('blood_requests')?.select(`
          *,
          patient:patients(
            id,
            user:user_profiles(full_name),
            emergency_contact_name,
            emergency_contact_phone
          ),
          hospital:hospitals(id, name, city, address)
        `)?.eq('blood_type', donor?.blood_type)?.in('status', ['pending', 'matched'])?.order('urgency_level')?.order('required_date')

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching pending requests:', error)
      throw error
    }
  },

  // Accept donation request
  async acceptDonationRequest(requestId, donationDate) {
    try {
      const donor = await this.getDonorProfile()
      if (!donor) throw new Error('Donor profile not found')

      // Update blood request to matched status
      const { data: request, error: requestError } = await supabase?.from('blood_requests')?.update({
          status: 'matched',
          matched_donor_id: donor?.id
        })?.eq('id', requestId)?.select()?.single()

      if (requestError) {
        throw new Error(requestError.message)
      }

      // Create donation record
      const { data: donation, error: donationError } = await supabase?.from('donations')?.insert([{
          donor_id: donor?.id,
          request_id: requestId,
          hospital_id: request?.hospital_id,
          donation_date: donationDate,
          status: 'scheduled'
        }])?.select()?.single()

      if (donationError) {
        throw new Error(donationError.message)
      }

      return { request, donation }
    } catch (error) {
      console.error('Error accepting donation request:', error)
      throw error
    }
  },

  // Get donor statistics
  async getDonorStats() {
    try {
      const donor = await this.getDonorProfile()
      if (!donor) return null

      const { data: donations, error } = await supabase?.from('donations')?.select('*')?.eq('donor_id', donor?.id)?.eq('status', 'completed')

      if (error) {
        throw new Error(error.message)
      }

      const totalDonations = donations?.length || 0
      const lastDonation = donations?.[0]?.donation_date || null

      return {
        totalDonations,
        lastDonation,
        reliabilityScore: donor?.reliability_score,
        nextEligibleDate: lastDonation 
          ? new Date(new Date(lastDonation).getTime() + 90 * 24 * 60 * 60 * 1000)
          : new Date()
      };
    } catch (error) {
      console.error('Error fetching donor stats:', error)
      throw error
    }
  }
}