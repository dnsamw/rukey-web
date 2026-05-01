-- Create banners table for configurable site banners/adverts
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  badge TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  cta_href TEXT NOT NULL,
  background_color TEXT NOT NULL,
  text_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_placement CHECK (
    placement IN (
      'hero_right',
      'home_after_services',
      'home_after_about',
      'home_before_contact',
      'about_after_story',
      'services_after_grid',
      'careers_after_roles',
      'contact_after_form',
      'service_detail_after_content'
    )
  )
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX idx_banners_placement ON public.banners (placement);
CREATE INDEX idx_banners_enabled ON public.banners (is_enabled);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read banners
CREATE POLICY "Banners are public" ON public.banners
  FOR SELECT USING (true);

-- Allow authenticated users to update banners (you can restrict to admin if needed)
CREATE POLICY "Authenticated users can update banners" ON public.banners
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert banners
CREATE POLICY "Authenticated users can insert banners" ON public.banners
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete banners
CREATE POLICY "Authenticated users can delete banners" ON public.banners
  FOR DELETE USING (auth.role() = 'authenticated');
