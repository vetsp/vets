CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock_level INTEGER NOT NULL,
  batch_number TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  status TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL,
  date TEXT NOT NULL,
  customer TEXT
);

CREATE TABLE IF NOT EXISTS operational_supplies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock_level INTEGER NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  last_used TEXT NOT NULL
);

alter publication supabase_realtime add table products;
alter publication supabase_realtime add table sales_transactions;
alter publication supabase_realtime add table operational_supplies;
