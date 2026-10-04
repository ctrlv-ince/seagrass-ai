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
