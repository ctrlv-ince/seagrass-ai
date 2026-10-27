-- ====================================================================
-- SEAGRASS AI — Supabase Database Setup & Schema Migration
-- Run this in the Supabase Dashboard -> SQL Editor -> New Query
-- ====================================================================

-- 1. Enable PostGIS extension for spatial queries (points, transects)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create Species Table
CREATE TABLE IF NOT EXISTS species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scientific_name VARCHAR(255) UNIQUE NOT NULL,
    common_name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed initial common Indo-Pacific seagrass species
INSERT INTO species (scientific_name, common_name, description)
VALUES 
    ('Enhalus acoroides', 'Ribbon Seagrass', 'Large, robust seagrass with strap-like leaves up to 1-2m long; common in muddy substrate and high wave dampening capacity.'),
    ('Thalassia hemprichii', 'Sickle Seagrass', 'Dominant reef-flat seagrass with curved ribbon blades; vital for coastal stabilization.'),
    ('Halodule pinifolia', 'Fiji Seagrass', 'Fast-growing pioneer species with narrow blades, found in intertidal and shallow subtidal zones.'),
    ('Cymodocea rotundata', 'Round-tipped Seagrass', 'Smooth-bordered blades with rounded tips; forms dense meadows in sheltered bays.'),
    ('Halophila ovalis', 'Paddle Grass', 'Small oval-leaved seagrass, highly resilient to sedimentation and grazing.')
ON CONFLICT (scientific_name) DO NOTHING;

-- 3. Create Surveys Table
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    surveyor_name VARCHAR(255),
    location_name VARCHAR(255),
    center_point GEOMETRY(POINT, 4326),
    status VARCHAR(50) DEFAULT 'draft',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_center_point ON surveys USING GIST(center_point);

-- 4. Create Survey Images Table
CREATE TABLE IF NOT EXISTS survey_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    filename VARCHAR(512) NOT NULL,
    s3_key VARCHAR(1024) NOT NULL,
    content_type VARCHAR(100) DEFAULT 'image/jpeg',
    gps_latitude DOUBLE PRECISION,
    gps_longitude DOUBLE PRECISION,
    location GEOMETRY(POINT, 4326),
    captured_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_survey_images_survey_id ON survey_images(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_images_location ON survey_images USING GIST(location);

-- 5. Create Transects Table
CREATE TABLE IF NOT EXISTS transects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    geometry GEOMETRY(LINESTRING, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transects_survey_id ON transects(survey_id);
CREATE INDEX IF NOT EXISTS idx_transects_geometry ON transects USING GIST(geometry);

-- 6. Create Quadrats Table
CREATE TABLE IF NOT EXISTS quadrats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transect_id UUID REFERENCES transects(id) ON DELETE CASCADE,
    position_along_transect DOUBLE PRECISION NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    coverage_percent DOUBLE PRECISION,
    species_id UUID REFERENCES species(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quadrats_transect_id ON quadrats(transect_id);
CREATE INDEX IF NOT EXISTS idx_quadrats_location ON quadrats USING GIST(location);

-- 7. Create Wave Attenuation Predictions Table
CREATE TABLE IF NOT EXISTS wave_attenuation_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    model_version VARCHAR(50) NOT NULL,
    seagrass_density DOUBLE PRECISION NOT NULL,
    blade_length_cm DOUBLE PRECISION NOT NULL,
    water_depth_m DOUBLE PRECISION NOT NULL,
    wave_height_m DOUBLE PRECISION NOT NULL,
    wave_period_s DOUBLE PRECISION NOT NULL,
    attenuation_percent DOUBLE PRECISION NOT NULL,
    confidence_lower DOUBLE PRECISION,
    confidence_upper DOUBLE PRECISION,
    raw_output JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wave_predictions_survey_id ON wave_attenuation_predictions(survey_id);

-- 8. Enable Storage Bucket for Seagrass Photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('seagrass-images', 'seagrass-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for images in bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'seagrass-images');

-- 9. Create User Profiles Table (synced from Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE NOT NULL,
    email VARCHAR(320) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user ON user_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- Automatic sync trigger: Copies newly registered Supabase auth users into user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (auth_user_id, email, full_name, role, is_active)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        true
    )
    ON CONFLICT (auth_user_id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name),
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Seed Demo Administrator
-- Fixed mock UID used for offline testing and demo sandboxes
INSERT INTO public.user_profiles (
    id,
    auth_user_id,
    email,
    full_name,
    role,
    is_active
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin@seagrass.demo',
    'Demo Administrator',
    'admin',
    true
)
ON CONFLICT (auth_user_id) DO UPDATE
SET role = 'admin',
    is_active = true,
    updated_at = now();

