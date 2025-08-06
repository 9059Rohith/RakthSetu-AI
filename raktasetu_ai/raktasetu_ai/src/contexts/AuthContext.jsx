import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)
        }
        setLoading(false)
      })?.catch(() => {
        setAuthError('Failed to initialize authentication. Please refresh the page.')
        setLoading(false)
      })

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
        setAuthError('')
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = (userId) => {
    supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()?.then(({ data, error }) => {
        if (error) {
          console.error('Error fetching user profile:', error)
          return
        }
        setUserProfile(data)
      })
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setAuthError('')
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || email?.split('@')?.[0],
            role: userData?.role || 'patient'
          }
        }
      })

      if (error) {
        setAuthError(error?.message)
        return { error }
      }

      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        return { error }
      }
      setAuthError('Something went wrong during signup. Please try again.')
      console.error('JavaScript error in signup:', error)
      return { error }
    }
  }

  const signIn = async (email, password) => {
    try {
      setAuthError('')
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })

      if (error) {
        setAuthError(error?.message)
        return { error }
      }

      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        return { error }
      }
      setAuthError('Something went wrong during signin. Please try again.')
      console.error('JavaScript error in signin:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      setAuthError('')
      const { error } = await supabase?.auth?.signOut()
      if (error) {
        setAuthError(error?.message)
        return { error }
      }
      setUser(null)
      setUserProfile(null)
      return { data: true }
    } catch (error) {
      setAuthError('Something went wrong during signout. Please try again.')
      console.error('JavaScript error in signout:', error)
      return { error }
    }
  }

  const resetPassword = async (email) => {
    try {
      setAuthError('')
      const { data, error } = await supabase?.auth?.resetPasswordForEmail(email)
      if (error) {
        setAuthError(error?.message)
        return { error }
      }
      return { data }
    } catch (error) {
      setAuthError('Something went wrong. Please try again.')
      console.error('JavaScript error in password reset:', error)
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      setAuthError('')
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()

      if (error) {
        setAuthError(error?.message)
        return { error }
      }

      setUserProfile(data)
      return { data }
    } catch (error) {
      setAuthError('Failed to update profile. Please try again.')
      console.error('JavaScript error in profile update:', error)
      return { error }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    setAuthError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}