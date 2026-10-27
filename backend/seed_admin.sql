-- ====================================================================
-- SEAGRASS AI — Admin Seeder & Supabase Auth Sync Trigger
-- Run in: Supabase Dashboard -> SQL Editor -> New Query
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Automatic User Synchronization Trigger
-- Automatically syncs new signups in auth.users to public.user_profiles
-- --------------------------------------------------------------------
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

-- Recreate trigger cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- --------------------------------------------------------------------
-- 2. Promote Existing Supabase User to Admin
-- Replace 'admin@seagrass.org' with the target user's email address
-- --------------------------------------------------------------------
DO $$
DECLARE
    target_email TEXT := 'admin@seagrass.org';
    target_user_id UUID;
BEGIN
    -- Look up user in auth.users
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email LIMIT 1;

    IF target_user_id IS NOT NULL THEN
        -- Update user_metadata in auth.users
        UPDATE auth.users
        SET raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{role}',
            '"admin"'
        )
        WHERE id = target_user_id;

        -- Upsert profile with admin privileges
        INSERT INTO public.user_profiles (auth_user_id, email, full_name, role, is_active)
        VALUES (
            target_user_id,
            target_email,
            'System Administrator',
            'admin',
            true
        )
        ON CONFLICT (auth_user_id) DO UPDATE
        SET role = 'admin',
            is_active = true,
            updated_at = now();

        RAISE NOTICE 'User % (UID: %) successfully promoted to administrator.', target_email, target_user_id;
    ELSE
        RAISE NOTICE 'User % not found in auth.users. Seeding into public.user_profiles only.', target_email;
    END IF;
END $$;


-- --------------------------------------------------------------------
-- 3. Seed Pre-configured Demo Administrator (Offline / Local Dev)
-- Fixed UID: 00000000-0000-0000-0000-000000000001
-- --------------------------------------------------------------------
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
