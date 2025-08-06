import { supabase } from '../lib/supabase';

export const patientService = {
  // Get patient profile for authenticated user
  async getPatientProfile() {
    try {
      const { data, error } = await supabase?.from('patients')?.select(`
          *,
          user:user_profiles(id, full_name, email, phone)
        `)?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error fetching patient profile:', error)
      throw error
    }
  },

  // Create patient profile
  async createPatientProfile(patientData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) throw new Error('No authenticated user')

      const { data, error } = await supabase?.from('patients')?.insert([{
          user_id: user?.id,
          ...patientData
        }])?.select()?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error creating patient profile:', error)
      throw error
    }
  },

  // Update patient profile
  async updatePatientProfile(updates) {
    try {
      const { data, error } = await supabase?.from('patients')?.update(updates)?.select()?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error updating patient profile:', error)
      throw error
    }
  },

  // Get blood requests for patient
  async getBloodRequests() {
    try {
      const { data, error } = await supabase?.from('blood_requests')?.select(`
          *,
          patient:patients(id, user_id),
          hospital:hospitals(id, name, city),
          matched_donor:donors(id, user_id, user_profiles(full_name, phone))
        `)?.order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching blood requests:', error)
      throw error
    }
  },

  // Create blood request
  async createBloodRequest(requestData) {
    try {
      const patient = await this.getPatientProfile()
      if (!patient) throw new Error('Patient profile not found')

      const { data, error } = await supabase?.from('blood_requests')?.insert([{
          patient_id: patient?.id,
          ...requestData
        }])?.select()?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error creating blood request:', error)
      throw error
    }
  },

  // Get next transfusion prediction
  async getNextTransfusionPrediction() {
    try {
      const patient = await this.getPatientProfile()
      if (!patient) return null

      const { data, error } = await supabase?.rpc('predict_next_transfusion', { patient_uuid: patient?.id })

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error getting transfusion prediction:', error)
      throw error
    }
  },

  // Get patient's notifications
  async getNotifications() {
    try {
      const { data, error } = await supabase?.from('notifications')?.select('*')?.order('created_at', { ascending: false })?.limit(50)

      if (error) {
        throw new Error(error.message)
      }
      return data || []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await supabase?.from('notifications')?.update({ is_read: true })?.eq('id', notificationId)?.select()?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  },

  // Create emergency request
  async createEmergencyRequest(emergencyData) {
    try {
      const patient = await this.getPatientProfile()
      if (!patient) throw new Error('Patient profile not found')

      const { data, error } = await supabase?.from('emergency_requests')?.insert([{
          patient_id: patient?.id,
          ...emergencyData
        }])?.select()?.single()

      if (error) {
        throw new Error(error.message)
      }
      return data
    } catch (error) {
      console.error('Error creating emergency request:', error)
      throw error
    }
  }
}