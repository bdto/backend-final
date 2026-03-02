-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    role       VARCHAR(20)  NOT NULL DEFAULT 'ROLE_USER',
    active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- ============================================
-- TABLA: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT       NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    image_url   VARCHAR(500),
    price       DECIMAL(10,2) NOT NULL,
    stock       INT          NOT NULL DEFAULT 0,
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ============================================
-- TABLA: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT       NOT NULL,
    product_name    VARCHAR(255) NOT NULL,
    quantity        INT          NOT NULL DEFAULT 1,
    total_price     DECIMAL(10,2) NOT NULL,
    status          VARCHAR(30)  NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================
-- TABLA: order_tracking
-- ============================================
CREATE TABLE IF NOT EXISTS order_tracking (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT       NOT NULL,
    status      VARCHAR(30)  NOT NULL,
    location    VARCHAR(255),
    description VARCHAR(500),
    tracked_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);