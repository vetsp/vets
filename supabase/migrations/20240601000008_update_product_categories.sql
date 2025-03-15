-- Update product categories to match the new structure
ALTER TABLE products DROP COLUMN IF EXISTS category;
ALTER TABLE products ADD COLUMN category TEXT NOT NULL DEFAULT 'SALES PRODUCT';
ALTER TABLE products ADD COLUMN subcategory TEXT NOT NULL DEFAULT 'vitamin';

-- Add the new categories to the realtime publication
alter publication supabase_realtime add table products;