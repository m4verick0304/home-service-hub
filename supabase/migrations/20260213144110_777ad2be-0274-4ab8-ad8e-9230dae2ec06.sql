
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  price_range TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  provider_name TEXT,
  provider_phone TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  address TEXT,
  scheduled_at TIMESTAMPTZ,
  eta_minutes INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_owner_of_profile(_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _profile_id AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner_of_booking(_booking_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.profiles p ON b.user_id = p.id
    WHERE b.id = _booking_id AND p.user_id = auth.uid()
  );
$$;

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (user_id = auth.uid());

-- Services RLS (public read)
CREATE POLICY "Services are publicly readable" ON public.services FOR SELECT USING (true);

-- Bookings RLS
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own bookings" ON public.bookings FOR DELETE
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed services
INSERT INTO public.services (name, description, category, icon, price_range) VALUES
  ('House Cleaning', 'Professional home cleaning service', 'cleaning', 'Sparkles', '₹499 - ₹1999'),
  ('Plumber', 'Expert plumbing repairs and installation', 'plumbing', 'Wrench', '₹299 - ₹1499'),
  ('Electrician', 'Electrical repairs and wiring', 'electrical', 'Zap', '₹349 - ₹1299'),
  ('Cook', 'Professional cooking service at your home', 'cooking', 'ChefHat', '₹599 - ₹2499'),
  ('Painter', 'Interior and exterior painting', 'painting', 'Paintbrush', '₹999 - ₹4999'),
  ('Carpenter', 'Furniture repair and woodwork', 'carpentry', 'Hammer', '₹499 - ₹2999');
