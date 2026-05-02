-- Upgrade site_settings to key/value JSON model used by admin pages.
-- This migration is safe to run on existing databases.

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS key TEXT,
  ADD COLUMN IF NOT EXISTS value JSONB,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'site_settings_key_unique'
      AND conrelid = 'public.site_settings'::regclass
  ) THEN
    ALTER TABLE public.site_settings
      ADD CONSTRAINT site_settings_key_unique UNIQUE (key);
  END IF;
END $$;

-- Backfill key/value rows from legacy columns if present.
DO $$
DECLARE
  has_legacy_logo BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'site_settings'
      AND column_name = 'logo_url'
  ) INTO has_legacy_logo;

  IF has_legacy_logo THEN
    WITH legacy AS (
      SELECT *
      FROM public.site_settings
      WHERE key IS NULL
      ORDER BY created_at ASC NULLS LAST
      LIMIT 1
    )
    INSERT INTO public.site_settings (key, value, created_at, updated_at)
    SELECT
      'general',
      jsonb_build_object(
        'company_name', 'Rukey Facility Services',
        'tagline', 'Professional Cleaning Across Australia',
        'phone', COALESCE(phone, '1300 565 576'),
        'email', COALESCE(email, 'info@rukey.com.au'),
        'abn', ''
      ),
      NOW(),
      NOW()
    FROM legacy
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value,
          updated_at = NOW();

    WITH legacy AS (
      SELECT *
      FROM public.site_settings
      WHERE key IS NULL
      ORDER BY created_at ASC NULLS LAST
      LIMIT 1
    )
    INSERT INTO public.site_settings (key, value, created_at, updated_at)
    SELECT
      'addresses',
      jsonb_build_array(
        jsonb_build_object(
          'area', COALESCE(city, 'Main Office'),
          'address', TRIM(BOTH ', ' FROM CONCAT_WS(', ', address, city, state, zip_code))
        )
      ),
      NOW(),
      NOW()
    FROM legacy
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value,
          updated_at = NOW();

    WITH legacy AS (
      SELECT *
      FROM public.site_settings
      WHERE key IS NULL
      ORDER BY created_at ASC NULLS LAST
      LIMIT 1
    )
    INSERT INTO public.site_settings (key, value, created_at, updated_at)
    SELECT
      'theme',
      jsonb_build_object(
        'primary', COALESCE(primary_color, '#F97316'),
        'primary_dark', '#EA6C0A',
        'secondary', COALESCE(secondary_color, '#1E3A5F'),
        'secondary_dark', '#162d4a'
      ),
      NOW(),
      NOW()
    FROM legacy
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value,
          updated_at = NOW();

    INSERT INTO public.site_settings (key, value, created_at, updated_at)
    VALUES (
      'social',
      jsonb_build_object('facebook', '#', 'instagram', '#', 'linkedin', '#'),
      NOW(),
      NOW()
    )
    ON CONFLICT (key) DO NOTHING;
  END IF;
END $$;

-- Ensure new pages have config rows to edit immediately.
INSERT INTO public.site_settings (key, value, created_at, updated_at)
VALUES
  (
    'about_page',
    jsonb_build_object(
      'sections', jsonb_build_object('hero', true, 'story', true, 'timeline', true, 'team', true, 'banner', true, 'get_quote', true),
      'hero', jsonb_build_object('eyebrow', 'Our Story', 'title', 'About Rukey', 'description', 'Over a decade of delivering trusted, professional facility services across Victoria and beyond.'),
      'story', jsonb_build_object('label', 'Who We Are', 'title', 'Victoria''s Cleaning Specialists Since 2012', 'paragraph_1', 'Rukey Facility Services was founded in Melbourne in 2012 with a simple mission - to deliver cleaning services so reliable and thorough that our clients never have to think about it again.', 'paragraph_2', 'From a small team of five, we''ve grown into one of Victoria''s most trusted facility management companies - serving 500+ clients across offices, schools, hospitals, gyms and government buildings. Every member of our team is trained, vetted and shares our commitment to excellence.', 'image_url', 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=900&q=80', 'years_trusted', '12+', 'badges', jsonb_build_array('ISO 9001 Certified', 'Eco-Friendly Products', 'Fully Insured', 'Police Checked Staff')),
      'timeline', jsonb_build_object('label', 'Our Journey', 'title', 'How We Got Here', 'items', jsonb_build_array(jsonb_build_object('year', '2012', 'event', 'Founded in Melbourne with a team of 5'))),
      'team', jsonb_build_object('label', 'Meet the Team', 'title', 'The People Behind Rukey', 'members', jsonb_build_array(jsonb_build_object('name', 'Michael Chen', 'role', 'Founder & CEO', 'initials', 'MC', 'color', '#1E3A5F')))
    ),
    NOW(),
    NOW()
  ),
  (
    'contact_page',
    jsonb_build_object(
      'sections', jsonb_build_object('hero', true, 'contact_form', true, 'business_hours', true, 'map', true, 'banner', true),
      'hero', jsonb_build_object('eyebrow', 'We''d Love to Hear From You', 'title', 'Contact Us', 'description', 'Have a question, want a quote, or just want to learn more? Our friendly team is here to help.'),
      'contact', jsonb_build_object('label', 'Contact Us', 'title', 'Get In Touch', 'subtitle', 'Have a question or ready to get started? Reach out and our friendly team will get back to you within one business day.', 'service_options', jsonb_build_array('Office Cleaning', 'School & Education', 'Medical & Healthcare', 'Gym & Fitness', 'Council & Government', 'Retail & Commercial', 'Industrial', 'Window Cleaning')),
      'map', jsonb_build_object('label', 'Find Us', 'title', 'Our Main Office', 'subtitle', 'Visit us or get in touch - our team is ready to help with your facility cleaning needs.'),
      'offices', jsonb_build_array(jsonb_build_object('area', 'Braeside', 'address', '17 Citrus Street Braeside, VIC 3195', 'is_main', true, 'is_visible', true)),
      'business_hours', jsonb_build_array(jsonb_build_object('day', 'Monday - Friday', 'hours', '7:00 AM - 6:00 PM'), jsonb_build_object('day', 'Saturday', 'hours', '8:00 AM - 4:00 PM'), jsonb_build_object('day', 'Sunday', 'hours', 'By Appointment'))
    ),
    NOW(),
    NOW()
  ),
  (
    'careers_page',
    jsonb_build_object(
      'sections', jsonb_build_object('hero', true, 'perks', true, 'jobs', true, 'fallback', true, 'banner', true, 'get_quote', true),
      'hero', jsonb_build_object('eyebrow', 'Join Our Team', 'title', 'Careers at Rukey', 'description', 'Build a rewarding career with one of Victoria''s most respected facility services companies. We invest in our people.'),
      'perks', jsonb_build_object('label', 'Why Work With Us', 'title', 'What We Offer Our Team', 'items', jsonb_build_array(jsonb_build_object('icon', '🕐', 'label', 'Flexible Hours'))),
      'jobs', jsonb_build_object('label', 'Open Positions', 'title', 'Current Opportunities', 'show_open_roles', true),
      'fallback', jsonb_build_object('title', 'Don''t see a role that fits?', 'message', 'If you''re enthusiastic about working in our company, feel free to contact us.', 'button_label', 'Send Your Resume', 'email', 'careers@rukey.com.au')
    ),
    NOW(),
    NOW()
  )
ON CONFLICT (key) DO NOTHING;
