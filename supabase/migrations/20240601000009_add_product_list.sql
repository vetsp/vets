-- Delete existing products
DELETE FROM products;

-- Insert the new product list
INSERT INTO products (name, category, subcategory, stock_level, batch_number, expiry_date, status, last_updated)
VALUES
('CG Basic', 'SALES PRODUCT', 'vitamin', 10, 'B001', '2025-12-31', 'In Stock', now()),
('CG MOM', 'SALES PRODUCT', 'vitamin', 10, 'B002', '2025-12-31', 'In Stock', now()),
('CG ESSENTIALS', 'SALES PRODUCT', 'vitamin', 10, 'B003', '2025-12-31', 'In Stock', now()),
('CG COLLABERRY', 'SALES PRODUCT', 'vitamin', 10, 'B004', '2025-12-31', 'In Stock', now()),
('CG TUMMY', 'SALES PRODUCT', 'vitamin', 10, 'B005', '2025-12-31', 'In Stock', now()),
('CG URIGOEL', 'SALES PRODUCT', 'vitamin', 10, 'B006', '2025-12-31', 'In Stock', now()),
('Chubby Balme Fungee', 'SALES PRODUCT', 'supplement', 10, 'B007', '2025-12-31', 'In Stock', now()),
('GOAT UP 30 Pouch', 'SALES PRODUCT', 'supplement', 10, 'B008', '2025-12-31', 'In Stock', now()),
('GOAT UP 90g JAR', 'SALES PRODUCT', 'supplement', 10, 'B009', '2025-12-31', 'In Stock', now()),
('FP Milk Cleanser 60ml', 'SALES PRODUCT', 'supplement', 10, 'B010', '2025-12-31', 'In Stock', now()),
('FP Milk Cleanser 100ml', 'SALES PRODUCT', 'supplement', 10, 'B011', '2025-12-31', 'In Stock', now()),
('FP Powder - 25g', 'SALES PRODUCT', 'supplement', 10, 'B012', '2025-12-31', 'In Stock', now()),
('Nyang-Nyang Spray', 'SALES PRODUCT', 'supplement', 10, 'B013', '2025-12-31', 'In Stock', now()),
('BD BASIC', 'SALES PRODUCT', 'vitamin', 10, 'B014', '2025-12-31', 'In Stock', now()),
('BD ESSENTIAL', 'SALES PRODUCT', 'vitamin', 10, 'B015', '2025-12-31', 'In Stock', now()),
('BD COLLABERRY', 'SALES PRODUCT', 'vitamin', 10, 'B016', '2025-12-31', 'In Stock', now()),
('BD TUMMY', 'SALES PRODUCT', 'vitamin', 10, 'B017', '2025-12-31', 'In Stock', now()),
('BD URIGOEL', 'SALES PRODUCT', 'vitamin', 10, 'B018', '2025-12-31', 'In Stock', now()),
('HAIRBALL HERO 50G', 'SALES PRODUCT', 'supplement', 10, 'B019', '2025-12-31', 'In Stock', now()),
('Hairball hero 100G', 'SALES PRODUCT', 'supplement', 10, 'B020', '2025-12-31', 'In Stock', now());