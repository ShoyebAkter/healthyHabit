-- Area table (locations)
CREATE TABLE area (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resident table (users)
CREATE TABLE resident (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (area_id) REFERENCES area(id)
);

-- SME (Eco-friendly companies)
CREATE TABLE sme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    sustainability_score DECIMAL(3,2),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product table
CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sme_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sme_id) REFERENCES sme(id)
);

-- Vote table (resident votes for products)
CREATE TABLE vote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT NOT NULL,
    product_id INT NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (resident_id, product_id), -- Prevent duplicate votes
    FOREIGN KEY (resident_id) REFERENCES resident(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Optional: Product categories
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Optional: Add category_id to product table
ALTER TABLE product ADD COLUMN category_id INT;
ALTER TABLE product ADD FOREIGN KEY (category_id) REFERENCES category(id);