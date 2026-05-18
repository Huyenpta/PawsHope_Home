-- ============================================================
-- PawsHope — Cài đặt MySQL cho dev (database + schema đầy đủ)
-- ============================================================
--
-- CHẠY MỘT LẦN:
--   mysql -u root -p < backend/src/main/resources/db/install-pawshope-mysql.sql
--
-- Hoặc mở MySQL Workbench / DBeaver, chọn Run script.
--
-- USER MẶC ĐỊNH admin/admin123 (+ dữ liệu mẫu):
--   File này chỉ tạo bảng (+ ca trực shifts). Seed + BCrypt của user chạy từ
--   Java (DbInitializer): bật APP_INIT_DB=true hoặc thêm --init-db khi khởi động
--   backend MỘT LẦN. Nếu không, có thể đăng ký qua POST /api/auth/register.
--
-- CẨN THẬN: Có DROP TABLE — chỉ dùng DB dev / pawshope mới.
--
-- ============================================================

CREATE DATABASE IF NOT EXISTS pawshope
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pawshope;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS item_donations;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS adoptions;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS kennels;
DROP TABLE IF EXISTS rescue_reports;
DROP TABLE IF EXISTS volunteer_schedules;
DROP TABLE IF EXISTS shifts;
DROP TABLE IF EXISTS volunteer_applications;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS adoption_guidelines;
DROP TABLE IF EXISTS organization_info;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE organization_info (
    id INT PRIMARY KEY DEFAULT 1,
    org_name VARCHAR(255),
    logo_url VARCHAR(255),
    hotline VARCHAR(20),
    email VARCHAR(100),
    facebook_link VARCHAR(255),
    address TEXT,
    mission_statement TEXT,
    CONSTRAINT chk_org_singleton CHECK (id = 1)
) ENGINE=InnoDB;

CREATE TABLE adoption_guidelines (
    guide_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority INT DEFAULT 0,
    INDEX idx_guidelines_priority (priority)
) ENGINE=InnoDB;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role ENUM('Admin', 'Volunteer', 'User') DEFAULT 'User',
    status TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
) ENGINE=InnoDB;

CREATE TABLE volunteer_applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    skills TEXT,
    reason_to_join TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_volapp_status (status)
) ENGINE=InnoDB;

CREATE TABLE shifts (
    shift_id INT PRIMARY KEY AUTO_INCREMENT,
    shift_name VARCHAR(50),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    crosses_midnight TINYINT(1) DEFAULT 0
) ENGINE=InnoDB;

INSERT INTO shifts (shift_name, start_time, end_time, crosses_midnight) VALUES
('Ca 1', '08:00:00', '12:00:00', 0),
('Ca 2', '12:00:00', '16:00:00', 0),
('Ca 3', '16:00:00', '20:00:00', 0),
('Ca 4', '20:00:00', '23:59:59', 1);

CREATE TABLE volunteer_schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    shift_id INT NOT NULL,
    work_date DATE NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_shift_reg (user_id, shift_id, work_date),
    INDEX idx_schedules_date (work_date, shift_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (shift_id) REFERENCES shifts(shift_id)
) ENGINE=InnoDB;

CREATE TABLE rescue_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    reporter_name VARCHAR(100),
    reporter_phone VARCHAR(20) NOT NULL,
    location_text TEXT NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    status ENUM('Pending', 'In Progress', 'Rescued', 'Failed') DEFAULT 'Pending',
    assigned_to INT NULL,
    tracking_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rescue_status (status),
    INDEX idx_rescue_assigned (assigned_to),
    INDEX idx_rescue_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE kennels (
    kennel_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    description TEXT
) ENGINE=InnoDB;

CREATE TABLE pets (
    pet_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    species ENUM('Dog', 'Cat', 'Other') NOT NULL,
    breed VARCHAR(100),
    age_months INT,
    status ENUM('New', 'Available', 'Medical Hold', 'Adopted', 'Deceased') DEFAULT 'New',
    image_url VARCHAR(255),
    kennel_id INT,
    from_report_id INT NULL,
    intake_date DATE,
    description TEXT,
    INDEX idx_pets_status (status),
    INDEX idx_pets_species (species),
    FOREIGN KEY (kennel_id) REFERENCES kennels(kennel_id) ON DELETE SET NULL,
    FOREIGN KEY (from_report_id) REFERENCES rescue_reports(report_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE adoptions (
    adoption_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL,
    user_id INT NOT NULL,
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Interviewing', 'Approved', 'Rejected') DEFAULT 'Pending',
    notes TEXT,
    processed_by INT,
    INDEX idx_adoptions_status (status),
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (processed_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_stock_non_negative CHECK (stock_quantity >= 0)
) ENGINE=InnoDB;

CREATE TABLE cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    order_status ENUM('Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled') DEFAULT 'Pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_orders_user_status (user_id, order_status),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB;

CREATE TABLE donations (
    donation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    donor_name_manual VARCHAR(100) DEFAULT 'Guest',
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(50),
    source_order_id INT NULL,
    purpose VARCHAR(255),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (source_order_id) REFERENCES orders(order_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE item_donations (
    item_donation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    donor_name_manual VARCHAR(100),
    item_name VARCHAR(150) NOT NULL,
    category ENUM('Food', 'Medical Supply', 'Cleaning', 'Equipment', 'Other'),
    quantity VARCHAR(50),
    status ENUM('Pending', 'Received', 'Used') DEFAULT 'Pending',
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE expenses (
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('Food', 'Medical', 'Utility', 'Facility', 'Others') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE notifications (
    noti_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    related_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_noti_user_read (user_id, is_read),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;
