-- First, check if products table is already in the publication
DO $$
BEGIN
  -- Only add to publication if not already a member
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
  END IF;
END
$$;

-- Add subcategory column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE products ADD COLUMN subcategory TEXT NOT NULL DEFAULT 'vitamin';
  END IF;
END
$$;

-- Update existing products with new category structure
UPDATE products
SET 
  category = CASE 
    WHEN category IN ('Vitamins') THEN 'SALES PRODUCT'
    WHEN category IN ('Supplements', 'Medications') THEN 'SALES PRODUCT'
    ELSE 'SALES PRODUCT'
  END,
  subcategory = CASE
    WHEN category = 'Vitamins' THEN 'vitamin'
    WHEN category IN ('Supplements', 'Medications') THEN 'supplement'
    ELSE 'vitamin'
  END
WHERE category IS NOT NULL;