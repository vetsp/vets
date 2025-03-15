-- Create product_movements table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  notes TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add to realtime publication if not already a member
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'product_movements'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE product_movements;
  END IF;
END
$$;