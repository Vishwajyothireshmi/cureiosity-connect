-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Insurance payers
CREATE TABLE public.insurance_payers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.insurance_payers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view payers"
  ON public.insurance_payers FOR SELECT
  TO public
  USING (true);

-- Insurance plans
CREATE TABLE public.insurance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payer_id UUID REFERENCES public.insurance_payers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  plan_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plans"
  ON public.insurance_plans FOR SELECT
  TO public
  USING (true);

-- Patient insurance
CREATE TABLE public.patient_insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.insurance_plans(id) ON DELETE SET NULL,
  member_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insurance"
  ON public.patient_insurance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own insurance"
  ON public.patient_insurance FOR ALL
  USING (auth.uid() = user_id);

-- Providers
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
  npi TEXT UNIQUE,
  accepts_telehealth BOOLEAN DEFAULT false,
  profile_url TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view providers"
  ON public.providers FOR SELECT
  TO public
  USING (true);

-- Locations
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view locations"
  ON public.locations FOR SELECT
  TO public
  USING (true);

-- Provider insurance (many-to-many)
CREATE TABLE public.provider_insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.insurance_plans(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, plan_id)
);

ALTER TABLE public.provider_insurance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view provider insurance"
  ON public.provider_insurance FOR SELECT
  TO public
  USING (true);

-- Appointment slots
CREATE TABLE public.slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  visit_type TEXT NOT NULL CHECK (visit_type IN ('in-person', 'telehealth')),
  is_booked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available slots"
  ON public.slots FOR SELECT
  TO public
  USING (true);

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES public.slots(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no-show')),
  visit_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Users can create own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = patient_id);

-- Triage logs
CREATE TABLE public.triage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  symptom_text TEXT NOT NULL,
  specialty TEXT,
  urgency TEXT CHECK (urgency IN ('routine', 'soon', 'urgent', 'emergency')),
  confidence NUMERIC(3,2),
  rationale JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.triage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own triage logs"
  ON public.triage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create triage logs"
  ON public.triage_logs FOR INSERT
  TO public
  WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();