import { supabase } from '../lib/supabase';

export const hospitalService = {
  // Get all hospitals (public access)
  async getAllHospitals() {
    try {
      const { data, error } = await supabase?.from('hospitals')?.select('*')?.eq('is_verified', true)?.order('name')

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching hospitals:', error)
      throw error
    }
  },

  // Get hospitals by city
  async getHospitalsByCity(city) {
    try {
      const { data, error } = await supabase?.from('hospitals')?.select('*')?.eq('city', city)?.eq('is_verified', true)?.order('name')

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching hospitals by city:', error)
      throw error
    }
  },

  // Get hospitals with thalassemia centers
  async getThalassemiaCenters() {
    try {
      const { data, error } = await supabase?.from('hospitals')?.select('*')?.eq('has_thalassemia_center', true)?.eq('is_verified', true)?.order('name')

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching thalassemia centers:', error)
      throw error
    }
  },

  // Get hospital details by ID
  async getHospitalById(hospitalId) {
    try {
      const { data, error } = await supabase?.from('hospitals')?.select('*')?.eq('id', hospitalId)?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error fetching hospital details:', error)
      throw error
    }
  },

  // Get blood requests for a hospital (admin only)
  async getHospitalBloodRequests(hospitalId) {
    try {
      const { data, error } = await supabase?.from('blood_requests')?.select(`
          *,
          patient:patients(
            id,
            blood_type,
            current_condition,
            user:user_profiles(full_name, phone)
          ),
          matched_donor:donors(
            id,
            user:user_profiles(full_name, phone)
          )
        `)?.eq('hospital_id', hospitalId)?.order('urgency_level')?.order('required_date')

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching hospital blood requests:', error)
      throw error
    }
  },

  // Get hospital blood inventory
  async getBloodInventory(hospitalId) {
    try {
      const { data, error } = await supabase?.from('hospitals')?.select('current_stock')?.eq('id', hospitalId)?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data?.current_stock || {}
    } catch (error) {
      console.error('Error fetching blood inventory:', error)
      throw error
    }
  },

  // Update blood inventory (admin only)
  async updateBloodInventory(hospitalId, inventory) {
    try {
      const { data, error } = await supabase?.from('hospitals')?.update({ current_stock: inventory })?.eq('id', hospitalId)?.select()?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error updating blood inventory:', error)
      throw error
    }
  },

  // Get upcoming donations for hospital
  async getUpcomingDonations(hospitalId) {
    try {
      const { data, error } = await supabase?.from('donations')?.select(`
          *,
          donor:donors(
            id,
            blood_type,
            user:user_profiles(full_name, phone)
          ),
          request:blood_requests(
            id,
            urgency_level,
            patient:patients(
              id,
              user:user_profiles(full_name)
            )
          )
        `)?.eq('hospital_id', hospitalId)?.eq('status', 'scheduled')?.gte('donation_date', new Date()?.toISOString()?.split('T')?.[0])?.order('donation_date')

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching upcoming donations:', error)
      throw error
    }
  },

  // Get emergency requests in city
  async getEmergencyRequests(city = 'Coimbatore') {
    try {
      const { data, error } = await supabase?.from('emergency_requests')?.select(`
          *,
          patient:patients(
            id,
            blood_type,
            user:user_profiles(full_name)
          ),
          hospital:hospitals(name, city)
        `)?.eq('status', 'pending')?.order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching emergency requests:', error)
      throw error
    }
  },

  // Search hospitals by name or city
  async searchHospitals(searchTerm) {
    try {
      const { data, error } = await supabase?.from('hospitals')?.select('*')?.or(`name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)?.eq('is_verified', true)?.order('name')

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error searching hospitals:', error)
      throw error
    }
  }
}