-- Add per-slide banner fields to hero_slides
-- Each slide can optionally display its own promotional banner ad

ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS banner_enabled    boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS banner_badge      text,
  ADD COLUMN IF NOT EXISTS banner_title      text,
  ADD COLUMN IF NOT EXISTS banner_description text,
  ADD COLUMN IF NOT EXISTS banner_cta_label  text,
  ADD COLUMN IF NOT EXISTS banner_cta_href   text,
  ADD COLUMN IF NOT EXISTS banner_bg_color   text,
  ADD COLUMN IF NOT EXISTS banner_text_color text,
  ADD COLUMN IF NOT EXISTS banner_accent_color text;
