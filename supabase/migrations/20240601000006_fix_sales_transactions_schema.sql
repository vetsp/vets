-- Fix sales_transactions table schema to use product_id instead of product
ALTER TABLE IF EXISTS sales_transactions
DROP COLUMN IF EXISTS product,
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id);

-- Check if the table exists before attempting to modify it
DO $$
BEGIN
  -- Check if sales_transactions table is not already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'sales_transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sales_transactions;
  END IF;
END
$$;