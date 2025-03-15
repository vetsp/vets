-- Add product catalog with initial stock of 10 each
INSERT INTO products (name, category, batch_number, expiry_date, stock_level, status)
VALUES
  ('CG Basic', 'Vitamins', 'B001', '2025-12-31', 10, 'In Stock'),
  ('CG MOM', 'Vitamins', 'B002', '2025-12-31', 10, 'In Stock'),
  ('CG ESSENTIALS', 'Vitamins', 'B003', '2025-12-31', 10, 'In Stock'),
  ('CG COLLABERRY', 'Supplements', 'B004', '2025-12-31', 10, 'In Stock'),
  ('CG TUMMY', 'Supplements', 'B005', '2025-12-31', 10, 'In Stock'),
  ('CG URIGOEL', 'Supplements', 'B006', '2025-12-31', 10, 'In Stock'),
  ('Chubby Balme Fungee', 'Medications', 'B007', '2025-12-31', 10, 'In Stock'),
  ('GOAT UP 30 Pouch', 'Supplements', 'B008', '2025-12-31', 10, 'In Stock'),
  ('GOAT UP 90g JAR', 'Supplements', 'B009', '2025-12-31', 10, 'In Stock'),
  ('FP Milk Cleanser 60ml', 'Medications', 'B010', '2025-12-31', 10, 'In Stock'),
  ('FP Milk Cleanser 100ml', 'Medications', 'B011', '2025-12-31', 10, 'In Stock'),
  ('FP Powder - 25g', 'Medications', 'B012', '2025-12-31', 10, 'In Stock'),
  ('Nyang-Nyang Spray', 'Medications', 'B013', '2025-12-31', 10, 'In Stock'),
  ('BD BASIC', 'Vitamins', 'B014', '2025-12-31', 10, 'In Stock'),
  ('BD ESSENTIAL', 'Vitamins', 'B015', '2025-12-31', 10, 'In Stock'),
  ('BD COLLABERRY', 'Supplements', 'B016', '2025-12-31', 10, 'In Stock'),
  ('BD TUMMY', 'Supplements', 'B017', '2025-12-31', 10, 'In Stock'),
  ('BD URIGOEL', 'Supplements', 'B018', '2025-12-31', 10, 'In Stock'),
  ('HAIRBALL HERO 50G', 'Supplements', 'B019', '2025-12-31', 10, 'In Stock'),
  ('Hairball hero 100G', 'Supplements', 'B020', '2025-12-31', 10, 'In Stock')
ON CONFLICT (id) DO NOTHING;