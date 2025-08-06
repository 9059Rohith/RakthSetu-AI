-- RaktaSetu AI - Complete Database Schema for Thalassemia Blood Transfusion Management
-- Integration Type: Complete new schema for fresh project
-- Dependencies: Fresh project with no existing tables

-- 1. TYPES
CREATE TYPE public.user_role AS ENUM ('admin', 'patient', 'caregiver', 'donor', 'hospital_admin', 'doctor');
CREATE TYPE public.blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE public.urgency_level AS ENUM ('critical', 'urgent', 'routine');
CREATE TYPE public.request_status AS ENUM ('pending', 'matched', 'scheduled', 'completed', 'cancelled');
CREATE TYPE public.donation_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.patient_condition AS ENUM ('stable', 'improving', 'critical', 'deteriorating');
CREATE TYPE public.hospital_type AS ENUM ('government', 'private', 'trust', 'specialty');

-- 2. CORE TABLES

-- User Profiles (Intermediary table for auth)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'patient'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Patients (Thalassemia patients)
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    date_of_birth DATE NOT NULL,
    blood_type public.blood_type NOT NULL,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    medical_history JSONB DEFAULT '{}',
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    current_condition public.patient_condition DEFAULT 'stable',
    last_transfusion_date DATE,
    next_predicted_transfusion DATE,
    transfusion_frequency_days INTEGER DEFAULT 21,
    iron_chelation_adherence DECIMAL(3,2) DEFAULT 0.85,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Donors
CREATE TABLE public.donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    blood_type public.blood_type NOT NULL,
    date_of_birth DATE NOT NULL,
    last_donation_date DATE,
    is_available BOOLEAN DEFAULT true,
    location_city TEXT NOT NULL,
    location_state TEXT NOT NULL DEFAULT 'Tamil Nadu',
    preferred_donation_time TEXT DEFAULT 'morning',
    medical_clearance_date DATE,
    donation_count INTEGER DEFAULT 0,
    reliability_score DECIMAL(3,2) DEFAULT 1.0,
    availability_radius_km INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals
CREATE TABLE public.hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type public.hospital_type NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Tamil Nadu',
    phone TEXT NOT NULL,
    email TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    blood_bank_capacity INTEGER DEFAULT 100,
    current_stock JSONB DEFAULT '{}',
    processing_time_hours INTEGER DEFAULT 4,
    has_thalassemia_center BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Blood Requests
CREATE TABLE public.blood_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    blood_type public.blood_type NOT NULL,
    urgency_level public.urgency_level NOT NULL,
    units_needed INTEGER DEFAULT 1,
    required_date DATE NOT NULL,
    status public.request_status DEFAULT 'pending',
    special_requirements JSONB DEFAULT '{}',
    ai_match_score DECIMAL(5,2),
    matched_donor_id UUID REFERENCES public.donors(id) ON DELETE SET NULL,
    appointment_scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Donations
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    donation_date DATE NOT NULL,
    status public.donation_status DEFAULT 'scheduled',
    units_donated INTEGER DEFAULT 1,
    pre_donation_vitals JSONB DEFAULT '{}',
    post_donation_notes TEXT,
    next_eligible_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- AI Matching History
CREATE TABLE public.ai_matching_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2) NOT NULL,
    factors_considered JSONB DEFAULT '{}',
    distance_km DECIMAL(6,2),
    travel_time_minutes INTEGER,
    compatibility_score DECIMAL(3,2),
    availability_score DECIMAL(3,2),
    reliability_score DECIMAL(3,2),
    is_selected BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Requests (For critical cases)
CREATE TABLE public.emergency_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    blood_type public.blood_type NOT NULL,
    units_needed INTEGER NOT NULL,
    critical_window_hours INTEGER DEFAULT 6,
    location_latitude DECIMAL(10,8),
    location_longitude DECIMAL(11,8),
    contact_phone TEXT NOT NULL,
    status public.request_status DEFAULT 'pending',
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. INDEXES
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_patients_blood_type ON public.patients(blood_type);
CREATE INDEX idx_patients_next_transfusion ON public.patients(next_predicted_transfusion);
CREATE INDEX idx_donors_user_id ON public.donors(user_id);
CREATE INDEX idx_donors_blood_type ON public.donors(blood_type);
CREATE INDEX idx_donors_availability ON public.donors(is_available, location_city);
CREATE INDEX idx_hospitals_city ON public.hospitals(city, state);
CREATE INDEX idx_blood_requests_patient_id ON public.blood_requests(patient_id);
CREATE INDEX idx_blood_requests_status ON public.blood_requests(status, urgency_level);
CREATE INDEX idx_donations_donor_id ON public.donations(donor_id);
CREATE INDEX idx_donations_date ON public.donations(donation_date);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, is_read);
CREATE INDEX idx_emergency_requests_status ON public.emergency_requests(status, created_at);

-- 4. ENABLE RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_matching_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;

-- 5. FUNCTIONS (Must be before RLS policies)

-- Function for automatic user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Function to predict next transfusion date
CREATE OR REPLACE FUNCTION public.predict_next_transfusion(patient_uuid UUID)
RETURNS DATE
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT 
  CASE 
    WHEN p.last_transfusion_date IS NOT NULL 
    THEN p.last_transfusion_date + (p.transfusion_frequency_days || ' days')::INTERVAL
    ELSE CURRENT_DATE + INTERVAL '21 days'
  END::DATE
FROM public.patients p
WHERE p.id = patient_uuid;
$$;

-- Function to calculate donor reliability score
CREATE OR REPLACE FUNCTION public.calculate_reliability_score(donor_uuid UUID)
RETURNS DECIMAL(3,2)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT 
  CASE 
    WHEN d.donation_count = 0 THEN 1.0
    ELSE LEAST(1.0, 
      (SELECT COUNT(*) * 1.0 / GREATEST(d.donation_count, 1)
       FROM public.donations don
       WHERE don.donor_id = donor_uuid AND don.status = 'completed'
      )
    )
  END
FROM public.donors d
WHERE d.id = donor_uuid;
$$;

-- Function for admin role check using auth metadata
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin'
         OR au.raw_user_meta_data->>'role' = 'hospital_admin')
)
$$;

-- 6. RLS POLICIES

-- Pattern 1: Core user tables (user_profiles)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for patients
CREATE POLICY "users_manage_own_patients"
ON public.patients
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for donors
CREATE POLICY "users_manage_own_donors"
ON public.donors
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read for hospitals, admin manage
CREATE POLICY "public_can_read_hospitals"
ON public.hospitals
FOR SELECT
TO public
USING (true);

CREATE POLICY "admin_manage_hospitals"
ON public.hospitals
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 2: User ownership for blood requests
CREATE POLICY "users_manage_blood_requests"
ON public.blood_requests
FOR ALL
TO authenticated
USING (
  patient_id IN (
    SELECT id FROM public.patients WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  patient_id IN (
    SELECT id FROM public.patients WHERE user_id = auth.uid()
  )
);

-- Pattern 2: User ownership for donations
CREATE POLICY "users_manage_own_donations"
ON public.donations
FOR ALL
TO authenticated
USING (
  donor_id IN (
    SELECT id FROM public.donors WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  donor_id IN (
    SELECT id FROM public.donors WHERE user_id = auth.uid()
  )
);

-- Pattern 2: Simple user ownership for notifications
CREATE POLICY "users_manage_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read for matching history, admin write
CREATE POLICY "public_can_read_ai_matching"
ON public.ai_matching_history
FOR SELECT
TO public
USING (true);

CREATE POLICY "admin_manage_ai_matching"
ON public.ai_matching_history
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 4: Public read for emergency requests
CREATE POLICY "public_can_read_emergency_requests"
ON public.emergency_requests
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_create_emergency_requests"
ON public.emergency_requests
FOR INSERT
TO authenticated
WITH CHECK (
  patient_id IN (
    SELECT id FROM public.patients WHERE user_id = auth.uid()
  )
);

-- 7. TRIGGERS
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_donors_updated_at
    BEFORE UPDATE ON public.donors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 8. MOCK DATA
DO $$
DECLARE
    admin_auth_id UUID := gen_random_uuid();
    patient1_auth_id UUID := gen_random_uuid();
    patient2_auth_id UUID := gen_random_uuid();
    donor1_auth_id UUID := gen_random_uuid();
    donor2_auth_id UUID := gen_random_uuid();
    doctor_auth_id UUID := gen_random_uuid();
    hospital1_id UUID := gen_random_uuid();
    hospital2_id UUID := gen_random_uuid();
    patient1_id UUID := gen_random_uuid();
    patient2_id UUID := gen_random_uuid();
    donor1_id UUID := gen_random_uuid();
    donor2_id UUID := gen_random_uuid();
    request1_id UUID := gen_random_uuid();
    request2_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@raktasetu.ai', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "RaktaSetu Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (patient1_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'anjali.patient@example.com', crypt('patient123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Anjali Krishnan", "role": "patient"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (patient2_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'ravi.caregiver@example.com', crypt('caregiver123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Ravi Kumar", "role": "caregiver"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (donor1_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'karthik.donor@example.com', crypt('donor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Karthik Subramanian", "role": "donor"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (donor2_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'priya.donor@example.com', crypt('donor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Priya Nair", "role": "donor"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (doctor_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'doctor@psg.hospital.com', crypt('doctor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Meera Sharma", "role": "hospital_admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create hospitals
    INSERT INTO public.hospitals (id, name, type, address, city, state, phone, email, latitude, longitude, has_thalassemia_center, is_verified) VALUES
        (hospital1_id, 'PSG Hospital', 'private', 'Avinashi Road, Peelamedu', 'Coimbatore', 'Tamil Nadu', '+91-422-2570170', 'info@psg.ac.in', 11.0168, 76.9558, true, true),
        (hospital2_id, 'Government Medical College Hospital', 'government', 'Trichy Road', 'Coimbatore', 'Tamil Nadu', '+91-422-2530210', 'gmch@tn.gov.in', 11.0041, 76.9597, true, true);

    -- Create patients
    INSERT INTO public.patients (id, user_id, date_of_birth, blood_type, weight, height, emergency_contact_name, emergency_contact_phone, current_condition, last_transfusion_date, next_predicted_transfusion, transfusion_frequency_days) VALUES
        (patient1_id, patient1_auth_id, '2014-03-15', 'O-', 35.5, 140.0, 'Rajesh Krishnan', '+91-9876543210', 'stable', '2025-01-15', '2025-02-05', 21),
        (patient2_id, patient2_auth_id, '2012-07-22', 'B+', 42.0, 145.0, 'Sunita Kumar', '+91-9876543211', 'stable', '2025-01-20', '2025-02-10', 21);

    -- Create donors
    INSERT INTO public.donors (id, user_id, blood_type, date_of_birth, last_donation_date, is_available, location_city, location_state, donation_count, reliability_score) VALUES
        (donor1_id, donor1_auth_id, 'O-', '1995-05-20', '2024-11-15', true, 'Coimbatore', 'Tamil Nadu', 8, 0.95),
        (donor2_id, donor2_auth_id, 'B+', '1992-08-10', '2024-10-20', true, 'Coimbatore', 'Tamil Nadu', 12, 0.98);

    -- Create blood requests
    INSERT INTO public.blood_requests (id, patient_id, hospital_id, blood_type, urgency_level, units_needed, required_date, status, matched_donor_id, ai_match_score) VALUES
        (request1_id, patient1_id, hospital1_id, 'O-', 'routine', 1, '2025-02-05', 'matched', donor1_id, 95.5),
        (request2_id, patient2_id, hospital2_id, 'B+', 'urgent', 1, '2025-02-08', 'pending', null, null);

    -- Create AI matching history
    INSERT INTO public.ai_matching_history (request_id, donor_id, match_score, factors_considered, distance_km, travel_time_minutes, compatibility_score, availability_score, reliability_score, is_selected) VALUES
        (request1_id, donor1_id, 95.5, '{"blood_compatibility": 1.0, "distance": 0.9, "availability": 1.0, "reliability": 0.95}'::jsonb, 12.5, 25, 1.0, 1.0, 0.95, true),
        (request2_id, donor2_id, 92.0, '{"blood_compatibility": 1.0, "distance": 0.85, "availability": 1.0, "reliability": 0.98}'::jsonb, 18.2, 35, 1.0, 1.0, 0.98, false);

    -- Create notifications
    INSERT INTO public.notifications (user_id, title, message, type, data) VALUES
        (patient1_auth_id, 'Transfusion Scheduled', 'Your blood transfusion has been scheduled for February 5th at PSG Hospital', 'appointment', '{"hospital_id": "' || hospital1_id || '", "date": "2025-02-05"}'::jsonb),
        (donor1_auth_id, 'Donation Request', 'A 10-year-old girl with Thalassemia needs your O- blood. Can you help?', 'donation_request', '{"request_id": "' || request1_id || '", "urgency": "routine"}'::jsonb),
        (patient2_auth_id, 'Next Transfusion Reminder', 'Your next predicted transfusion is due in 3 days', 'reminder', '{"days_remaining": 3}'::jsonb);

    -- Create sample donation
    INSERT INTO public.donations (donor_id, request_id, hospital_id, donation_date, status, units_donated) VALUES
        (donor1_id, request1_id, hospital1_id, '2025-02-05', 'scheduled', 1);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;