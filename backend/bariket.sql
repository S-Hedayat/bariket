-- ==============================
-- Bariket Database
-- ==============================
CREATE DATABASE IF NOT EXISTS Bariket;
USE Bariket;

-- ==============================
-- Accounts Table
-- ==============================
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'moderator', 'super') DEFAULT 'user',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO accounts (name, email, password, role, status)
VALUES 
('سمیه رضایی', 'somayeh@example.com', 'hashed_password_1', 'user', 'active'),
('علی کریمی', 'ali.karimi@example.com', 'hashed_password_2', 'moderator', 'active'),
('admin', 'admin@bariket.com', 'hashed_password_3', 'super', 'active');

-- ==============================
-- Categories Table
-- ==============================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO categories (name)
VALUES 
('لپ‌تاپ'),
('موبایل'),
('تبلت');

-- ==============================
-- Products Table
-- ==============================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoryID INT NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    cpu VARCHAR(100),
    ram VARCHAR(50),
    storage VARCHAR(50),
    os VARCHAR(50),
    stockStatus TINYINT DEFAULT 1,
    numStockStatus INT DEFAULT 0,
    priceUSD DECIMAL(10,2) DEFAULT 0,
    offs DECIMAL(5,2) DEFAULT 0,
    avator VARCHAR(255) DEFAULT '',
    FOREIGN KEY (categoryID) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_categoryID (categoryID)
) ENGINE=InnoDB;

INSERT INTO products (categoryID, brand, model, cpu, ram, storage, os, stockStatus, numStockStatus, priceUSD, offs, avator)
VALUES 
(1, 'Dell', 'XPS 13', 'Intel i7', '16GB', '512GB SSD', 'Windows 11', 1, 10, 1200.00, 10.00, 'xps13.jpg'),
(2, 'Samsung', 'Galaxy S23', 'Snapdragon 8 Gen 2', '8GB', '256GB', 'Android 13', 1, 25, 999.99, 5.00, 's23.jpg'),
(3, 'Apple', 'iPad Air', 'Apple M1', '8GB', '256GB', 'iPadOS', 1, 15, 699.00, 7.50, 'ipadair.jpg'),
(1, 'HP', 'Spectre x360', 'Intel i7', '16GB', '1TB SSD', 'Windows 11', 1, 8, 1399.00, 12.00, 'spectre.jpg'),
(2, 'Apple', 'iPhone 15', 'A17 Bionic', '8GB', '512GB', 'iOS 17', 1, 30, 1199.00, 7.00, 'iphone15.jpg');

-- ==============================
-- Comments Table
-- ==============================
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productID INT NOT NULL,
    accountID INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productID) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (accountID) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_productID (productID),
    INDEX idx_accountID (accountID)
) ENGINE=InnoDB;

INSERT INTO comments (productID, accountID, content)
VALUES
(1, 1, 'لپ‌تاپ بسیار سریع و سبک هست، برای کارهای روزمره عالیه.'),
(2, 2, 'دوربین فوق‌العاده‌ای داره، باتری هم خوبه.'),
(3, 1, 'برای طراحی گرافیکی خیلی مناسب نیست ولی برای مطالعه عالیه.'),
(1, 2, 'کیفیت محصول عالی بود، خیلی راضی هستم.'),
(1, 3, 'قیمتش نسبت به کیفیتش خوبه.'),
(2, 3, 'متاسفانه دیر به دستم رسید.'),
(3, 2, 'رنگ و ظاهر محصول خیلی خوبه.'),
(2, 1, 'عملکرد محصول متوسط است.'),
(3, 3, 'پشتیبانی خیلی سریع جواب داد، ممنون.'),
(1, 1, 'محصول دقیقا همونی بود که انتظار داشتم.');

-- ==============================
-- Orders Table
-- ==============================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accountID INT NOT NULL,
    total DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending','paid','shipped','completed','canceled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (accountID) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_accountID (accountID)
) ENGINE=InnoDB;

INSERT INTO orders (accountID, total, status)
VALUES 
(1, 1299.99, 'paid'),
(2, 699.00, 'pending');

-- ==============================
-- Order_Items Table
-- ==============================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT NOT NULL,
    productID INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (orderID) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_orderID (orderID),
    INDEX idx_productID (productID)
) ENGINE=InnoDB;

INSERT INTO order_items (orderID, productID, quantity, price)
VALUES 
(1, 1, 1, 1200.00),
(1, 2, 1, 999.99),
(2, 3, 1, 699.00);
