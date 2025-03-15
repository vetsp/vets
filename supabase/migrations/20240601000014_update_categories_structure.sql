-- Update product categories structure
TRUNCATE product_categories CASCADE;

-- Insert main categories
INSERT INTO product_categories (id, name, description, parent_id)
VALUES 
  ('c1000000-0000-0000-0000-000000000001', 'SALES', 'Sales products', NULL),
  ('c2000000-0000-0000-0000-000000000001', 'PRODUCTION', 'Production equipment', NULL);

-- Insert subcategories for SALES
INSERT INTO product_categories (id, name, description, parent_id)
VALUES 
  ('c1100000-0000-0000-0000-000000000001', 'Vitamins & Supplements', 'Vitamin and supplement products', 'c1000000-0000-0000-0000-000000000001'),
  ('c1200000-0000-0000-0000-000000000001', 'Skincare & Hygiene', 'Skincare and hygiene products', 'c1000000-0000-0000-0000-000000000001'),
  ('c1300000-0000-0000-0000-000000000001', 'Others', 'Other sales products', 'c1000000-0000-0000-0000-000000000001');

-- Insert subcategories for PRODUCTION
INSERT INTO product_categories (id, name, description, parent_id)
VALUES 
  ('c2100000-0000-0000-0000-000000000001', 'Production & Processing Equipment', 'Equipment for production and processing', 'c2000000-0000-0000-0000-000000000001'),
  ('c2200000-0000-0000-0000-000000000001', 'Packaging & Labeling Tools', 'Tools for packaging and labeling', 'c2000000-0000-0000-0000-000000000001');

-- Add parent_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_categories' AND column_name = 'parent_id') THEN
    ALTER TABLE product_categories ADD COLUMN parent_id UUID REFERENCES product_categories(id);
  END IF;
END $$;

-- Clear existing products
TRUNCATE products CASCADE;

-- Insert products for Vitamins & Supplements
INSERT INTO products (name, category, subcategory, category_id, stock_level, batch_number, expiry_date, status, last_updated)
VALUES
  ('CG Basic', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B001', '2025-12-31', 'In Stock', now()),
  ('CG MOM', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B002', '2025-12-31', 'In Stock', now()),
  ('CG ESSENTIALS', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B003', '2025-12-31', 'In Stock', now()),
  ('CG COLLABERRY', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B004', '2025-12-31', 'In Stock', now()),
  ('CG TUMMY', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B005', '2025-12-31', 'In Stock', now()),
  ('CG URIGOEL', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B006', '2025-12-31', 'In Stock', now()),
  ('BD BASIC', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B007', '2025-12-31', 'In Stock', now()),
  ('BD ESSENTIAL', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B008', '2025-12-31', 'In Stock', now()),
  ('BD COLLABERRY', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B009', '2025-12-31', 'In Stock', now()),
  ('BD TUMMY', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B010', '2025-12-31', 'In Stock', now()),
  ('BD URIGOEL', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B011', '2025-12-31', 'In Stock', now()),
  ('GOAT UP 30 Pouch', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B012', '2025-12-31', 'In Stock', now()),
  ('GOAT UP 90g JAR', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B013', '2025-12-31', 'In Stock', now()),
  ('Hairball Hero 50G', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B014', '2025-12-31', 'In Stock', now()),
  ('Hairball Hero 100G', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 10, 'B015', '2025-12-31', 'In Stock', now());

-- Insert products for Skincare & Hygiene
INSERT INTO products (name, category, subcategory, category_id, stock_level, batch_number, expiry_date, status, last_updated)
VALUES
  ('Chubby Balme Fungee', 'SALES', 'Skincare & Hygiene', 'c1200000-0000-0000-0000-000000000001', 10, 'B016', '2025-12-31', 'In Stock', now()),
  ('FP Milk Cleanser 60ml', 'SALES', 'Skincare & Hygiene', 'c1200000-0000-0000-0000-000000000001', 10, 'B017', '2025-12-31', 'In Stock', now()),
  ('FP Milk Cleanser 100ml', 'SALES', 'Skincare & Hygiene', 'c1200000-0000-0000-0000-000000000001', 10, 'B018', '2025-12-31', 'In Stock', now()),
  ('FP Powder - 25g', 'SALES', 'Skincare & Hygiene', 'c1200000-0000-0000-0000-000000000001', 10, 'B019', '2025-12-31', 'In Stock', now());

-- Insert products for Others
INSERT INTO products (name, category, subcategory, category_id, stock_level, batch_number, expiry_date, status, last_updated)
VALUES
  ('Nyang-Nyang Spray', 'SALES', 'Others', 'c1300000-0000-0000-0000-000000000001', 10, 'B020', '2025-12-31', 'In Stock', now());

-- Insert production equipment
INSERT INTO products (name, category, subcategory, category_id, stock_level, batch_number, expiry_date, status, last_updated)
VALUES
  ('Mixing & Blending Machine', 'PRODUCTION', 'Production & Processing Equipment', 'c2100000-0000-0000-0000-000000000001', 2, 'E001', '2030-12-31', 'In Stock', now()),
  ('Powder & Granule Mixer', 'PRODUCTION', 'Production & Processing Equipment', 'c2100000-0000-0000-0000-000000000001', 1, 'E002', '2030-12-31', 'In Stock', now()),
  ('Tablet Press Machine', 'PRODUCTION', 'Production & Processing Equipment', 'c2100000-0000-0000-0000-000000000001', 1, 'E003', '2030-12-31', 'In Stock', now()),
  ('Capsule Filling Machine', 'PRODUCTION', 'Production & Processing Equipment', 'c2100000-0000-0000-0000-000000000001', 1, 'E004', '2030-12-31', 'In Stock', now()),
  ('Liquid Filling Machine', 'PRODUCTION', 'Production & Processing Equipment', 'c2100000-0000-0000-0000-000000000001', 1, 'E005', '2030-12-31', 'In Stock', now()),
  ('Homogenizer', 'PRODUCTION', 'Production & Processing Equipment', 'c2100000-0000-0000-0000-000000000001', 1, 'E006', '2030-12-31', 'In Stock', now()),
  ('Precision Weighing Scale', 'PRODUCTION', 'Production & Processing Equipment', 'c2100000-0000-0000-0000-000000000001', 3, 'E007', '2030-12-31', 'In Stock', now());

-- Insert packaging tools
INSERT INTO products (name, category, subcategory, category_id, stock_level, batch_number, expiry_date, status, last_updated)
VALUES
  ('Sealing Machine', 'PRODUCTION', 'Packaging & Labeling Tools', 'c2200000-0000-0000-0000-000000000001', 2, 'E008', '2030-12-31', 'In Stock', now()),
  ('Labeling Machine', 'PRODUCTION', 'Packaging & Labeling Tools', 'c2200000-0000-0000-0000-000000000001', 1, 'E009', '2030-12-31', 'In Stock', now()),
  ('Batch Coding Machine', 'PRODUCTION', 'Packaging & Labeling Tools', 'c2200000-0000-0000-0000-000000000001', 1, 'E010', '2030-12-31', 'In Stock', now()),
  ('Bottle/Jar Capping Machine', 'PRODUCTION', 'Packaging & Labeling Tools', 'c2200000-0000-0000-0000-000000000001', 1, 'E011', '2030-12-31', 'In Stock', now()),
  ('Pouch Packing Machine', 'PRODUCTION', 'Packaging & Labeling Tools', 'c2200000-0000-0000-0000-000000000001', 1, 'E012', '2030-12-31', 'In Stock', now()),
  ('Shrink Wrapping Machine', 'PRODUCTION', 'Packaging & Labeling Tools', 'c2200000-0000-0000-0000-000000000001', 1, 'E013', '2030-12-31', 'In Stock', now());

-- Add 10 more sales products
INSERT INTO products (name, category, subcategory, category_id, stock_level, batch_number, expiry_date, status, last_updated)
VALUES
  ('CG Immune Booster', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 15, 'B021', '2025-12-31', 'In Stock', now()),
  ('CG Joint Support', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 12, 'B022', '2025-12-31', 'In Stock', now()),
  ('BD Skin Health', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 8, 'B023', '2025-12-31', 'Low Stock', now()),
  ('BD Digestive Aid', 'SALES', 'Vitamins & Supplements', 'c1100000-0000-0000-0000-000000000001', 20, 'B024', '2025-12-31', 'In Stock', now()),
  ('Pet Dental Spray', 'SALES', 'Skincare & Hygiene', 'c1200000-0000-0000-0000-000000000001', 15, 'B025', '2025-12-31', 'In Stock', now()),
  ('Ear Cleaning Solution', 'SALES', 'Skincare & Hygiene', 'c1200000-0000-0000-0000-000000000001', 18, 'B026', '2025-12-31', 'In Stock', now()),
  ('Paw Protection Balm', 'SALES', 'Skincare & Hygiene', 'c1200000-0000-0000-0000-000000000001', 7, 'B027', '2025-12-31', 'Low Stock', now()),
  ('Anti-Itch Spray', 'SALES', 'Others', 'c1300000-0000-0000-0000-000000000001', 14, 'B028', '2025-12-31', 'In Stock', now()),
  ('Calming Drops', 'SALES', 'Others', 'c1300000-0000-0000-0000-000000000001', 9, 'B029', '2025-12-31', 'Low Stock', now()),
  ('Travel Sickness Relief', 'SALES', 'Others', 'c1300000-0000-0000-0000-000000000001', 11, 'B030', '2025-12-31', 'In Stock', now());