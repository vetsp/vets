-- This migration fixes the error with realtime publication
-- It checks if tables exist in the publication before adding them

DO $$
BEGIN
  -- Check if products table is not already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
  END IF;
  
  -- Check if sales_transactions table is not already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'sales_transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sales_transactions;
  END IF;
  
  -- Check if operational_supplies table is not already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'operational_supplies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE operational_supplies;
  END IF;
END
$$;