-- Create product_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category_id') THEN
    ALTER TABLE products ADD COLUMN category_id UUID REFERENCES product_categories(id);
  END IF;
END $$;

-- Add to realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'product_categories'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE product_categories;
  END IF;
END
$$;

-- Insert default categories based on existing subcategories
INSERT INTO product_categories (name, description)
VALUES 
  ('Vitamin', 'Vitamin products for pets'),
  ('Supplement', 'Supplement products for pets'),
  ('Medication', 'Medication products for pets'),
  ('Baking', 'Baking supplies for operations'),
  ('Operation', 'General operational supplies'),
  ('Marketing', 'Marketing materials and supplies'),
  ('Production', 'Production equipment and supplies');
