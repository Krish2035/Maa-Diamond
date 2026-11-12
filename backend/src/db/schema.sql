-- ==============================================================================
-- MAA DIAMOND ENTERPRISE DATABASE SCHEMA (POSTGRESQL)
-- Conforming to 112 Web Architecture & Production Engineering Pillars
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE (Authentication & RBAC: ADMIN vs BUYER)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. DIAMONDS TABLE (Wholesale Diamond Inventory & 4Cs Specification)
CREATE TABLE IF NOT EXISTS diamonds (
    id VARCHAR(64) PRIMARY KEY,
    stock_number VARCHAR(64) NOT NULL UNIQUE,
    shape VARCHAR(32) NOT NULL,
    carat NUMERIC(8, 2) NOT NULL CHECK (carat > 0),
    color VARCHAR(10) NOT NULL,
    clarity VARCHAR(10) NOT NULL,
    cut VARCHAR(32) NOT NULL DEFAULT 'Ideal',
    polish VARCHAR(32) NOT NULL DEFAULT 'Excellent',
    symmetry VARCHAR(32) NOT NULL DEFAULT 'Excellent',
    fluorescence VARCHAR(32) NOT NULL DEFAULT 'None',
    lab VARCHAR(16) NOT NULL DEFAULT 'GIA' CHECK (lab IN ('GIA', 'IGI', 'HRD', 'None')),
    certificate_no VARCHAR(64) NOT NULL,
    dimensions VARCHAR(64) NOT NULL,
    price_per_carat NUMERIC(12, 2) NOT NULL CHECK (price_per_carat >= 0),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    image_url TEXT NOT NULL,
    video_url TEXT DEFAULT '',
    description TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_diamonds_shape ON diamonds(shape);
CREATE INDEX IF NOT EXISTS idx_diamonds_color ON diamonds(color);
CREATE INDEX IF NOT EXISTS idx_diamonds_clarity ON diamonds(clarity);
CREATE INDEX IF NOT EXISTS idx_diamonds_carat ON diamonds(carat);
CREATE INDEX IF NOT EXISTS idx_diamonds_stock ON diamonds(stock_number);
CREATE INDEX IF NOT EXISTS idx_diamonds_available ON diamonds(is_available);

-- 4. INQUIRIES TABLE (B2B RFQ Pipeline & CRM)
CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(64) PRIMARY KEY,
    inquiry_number VARCHAR(64) NOT NULL UNIQUE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    diamond_id VARCHAR(64) REFERENCES diamonds(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    target_shape VARCHAR(32),
    target_carat VARCHAR(32),
    target_budget VARCHAR(64),
    notes TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_PROGRESS', 'QUOTED', 'CLOSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- 5. CARD PROFILES TABLE (Executive Visiting Card & Digital vCard Specs)
CREATE TABLE IF NOT EXISTS card_profiles (
    id VARCHAR(64) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL DEFAULT 'MAA DIAMOND',
    tagline VARCHAR(255) NOT NULL,
    directors VARCHAR(255) NOT NULL,
    primary_phone VARCHAR(50) NOT NULL,
    secondary_phone VARCHAR(50) NOT NULL,
    primary_email VARCHAR(255) NOT NULL,
    website_url VARCHAR(255) NOT NULL,
    card_url VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SCAN LOGS TABLE (QR Card Scan Events & Analytics)
CREATE TABLE IF NOT EXISTS scan_logs (
    id VARCHAR(64) PRIMARY KEY,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_scan_logs_scanned_at ON scan_logs(scanned_at DESC);

-- ==============================================================================
-- 7. INITIAL SEED DATA (SUPER ADMIN & PREMIER SURAT DIAMONDS)
-- ==============================================================================

-- Super Admin User (admin@maadiamond.com / Admin@123)
INSERT INTO users (id, email, password_hash, name, company_name, phone, role)
VALUES (
    'usr_admin_001',
    'admin@maadiamond.com',
    '$2a$10$ifiG1R1.Pk/klse6QGhMhex/QaDd96B6NQYfDPx2Cj7lY.Md2j5n2',
    'Maa Diamond Management',
    'Maa Diamond',
    '+91 90333 20326',
    'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Initial Catalog Diamonds (Surat Diamond Bourse Stock)
INSERT INTO diamonds (
    id, stock_number, shape, carat, color, clarity, cut, polish, symmetry,
    fluorescence, lab, certificate_no, dimensions, price_per_carat, total_price,
    image_url, description, is_featured, is_available
) VALUES
(
    'dia_rnd_001', 'MD-RND-152', 'Round', 1.52, 'D', 'VVS1', 'Ideal', 'Excellent', 'Excellent',
    'None', 'GIA', '2235914872', '7.38 x 7.42 x 4.56 mm', 8200, 12464,
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    'Triple Excellent GIA-certified Round Brilliant cut natural diamond from Surat Diamond Bourse.',
    true, true
),
(
    'dia_mrq_002', 'MD-MRQ-201', 'Marquise', 2.01, 'E', 'VVS2', 'Ideal', 'Excellent', 'Very Good',
    'Faint', 'GIA', '5192847291', '12.45 x 6.22 x 3.85 mm', 7400, 14874,
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    'Elongated Marquise cut natural diamond with extraordinary fire and dispersion.',
    true, true
),
(
    'dia_prn_003', 'MD-PRN-180', 'Princess', 1.80, 'D', 'IF', 'Ideal', 'Excellent', 'Excellent',
    'None', 'IGI', '4982716301', '6.85 x 6.82 x 4.90 mm', 6900, 12420,
    'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80',
    'Internally Flawless Princess cut diamond featuring crisp 90-degree geometric facet alignment.',
    true, true
),
(
    'dia_emr_004', 'MD-EMR-250', 'Emerald', 2.50, 'F', 'VS1', 'Very Good', 'Excellent', 'Excellent',
    'None', 'GIA', '6382910482', '9.10 x 6.50 x 4.20 mm', 8600, 21500,
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80',
    'Step-cut Emerald diamond displaying classic hall-of-mirrors optical brilliance.',
    true, true
) ON CONFLICT (stock_number) DO NOTHING;


