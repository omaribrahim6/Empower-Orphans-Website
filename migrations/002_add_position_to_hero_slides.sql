-- Add position column to hero_slides table
-- This stores the vertical position percentage (0-100) for cropping images

ALTER TABLE public.hero_slides
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 50;

-- Add comment to explain the column
COMMENT ON COLUMN public.hero_slides.position IS 'Vertical position percentage (0-100) for object-position CSS property. Controls which part of the image is visible when cropped.';

-- Update existing rows to have default position of 50 (center)
UPDATE public.hero_slides
SET position = 50
WHERE position IS NULL;
