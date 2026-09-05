-- Oracle Database Schema for E-Commerce Website

-- 1. Users Table
CREATE TABLE Users (
    id VARCHAR2(255) PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    email VARCHAR2(255) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    role VARCHAR2(50) DEFAULT 'CUSTOMER',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE Categories (
    id VARCHAR2(255) PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    slug VARCHAR2(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE Products (
    id VARCHAR2(255) PRIMARY KEY,
    sku VARCHAR2(100) UNIQUE NOT NULL,
    name VARCHAR2(255) NOT NULL,
    slug VARCHAR2(255) UNIQUE NOT NULL,
    description CLOB,
    price NUMBER(10, 2) NOT NULL,
    stock NUMBER DEFAULT 0,
    categoryId VARCHAR2(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_category FOREIGN KEY (categoryId) REFERENCES Categories(id)
);

-- 4. ProductImages Table
CREATE TABLE ProductImages (
    id VARCHAR2(255) PRIMARY KEY,
    productId VARCHAR2(255) NOT NULL,
    fileId VARCHAR2(255) NOT NULL,
    imageUrl VARCHAR2(1000) NOT NULL,
    sortOrder NUMBER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_image FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- 5. Orders Table
CREATE TABLE Orders (
    id VARCHAR2(255) PRIMARY KEY,
    userId VARCHAR2(255) NOT NULL,
    totalPrice NUMBER(10, 2) NOT NULL,
    status VARCHAR2(50) DEFAULT 'PENDING',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (userId) REFERENCES Users(id)
);

-- 6. OrderItems Table
CREATE TABLE OrderItems (
    id VARCHAR2(255) PRIMARY KEY,
    orderId VARCHAR2(255) NOT NULL,
    productId VARCHAR2(255) NOT NULL,
    quantity NUMBER NOT NULL,
    price NUMBER(10, 2) NOT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product FOREIGN KEY (productId) REFERENCES Products(id)
);

-- 7. Settings Table
CREATE TABLE Settings (
    id VARCHAR2(255) PRIMARY KEY,
    siteName VARCHAR2(255) NOT NULL,
    logo VARCHAR2(1000),
    contactPhone VARCHAR2(50),
    contactEmail VARCHAR2(255),
    facebook VARCHAR2(255),
    lineId VARCHAR2(255)
);

-- Optional: Triggers for updatedAt in Products table
CREATE OR REPLACE TRIGGER update_product_updatedAt
BEFORE UPDATE ON Products
FOR EACH ROW
BEGIN
    :NEW.updatedAt := CURRENT_TIMESTAMP;
END;
/
