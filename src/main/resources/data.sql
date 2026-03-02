-- ============================================
-- USUARIOS DE DEMO (Tarea 1)
-- admin123 y user123 codificados en BCrypt
-- ============================================
INSERT IGNORE INTO users (username, password, email, role, active) VALUES
('admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'admin@demo.com', 'ROLE_ADMIN', true),
('user',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'user@demo.com',  'ROLE_USER',  true);

-- ============================================
-- CATEGORIAS DE DEMO
-- ============================================
INSERT IGNORE INTO categories (name, description) VALUES
('Electronica', 'Dispositivos electronicos y gadgets'),
('Ropa', 'Prendas de vestir y accesorios'),
('Hogar', 'Articulos para el hogar');

-- ============================================
-- PRODUCTOS DE DEMO
-- ============================================
INSERT IGNORE INTO products (category_id, name, description, price, stock, active) VALUES
(1, 'Laptop Pro 15',    'Laptop de alto rendimiento 16GB RAM', 1299.99, 50, true),
(1, 'Auriculares BT',   'Auriculares bluetooth con cancelacion de ruido', 89.99, 200, true),
(2, 'Camiseta Basica',  'Camiseta de algodon 100%', 19.99, 500, true),
(3, 'Lampara LED',      'Lampara de escritorio LED regulable', 34.99, 150, true);