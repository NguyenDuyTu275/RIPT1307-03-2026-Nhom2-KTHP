USE javacuoiky;
ALTER TABLE users DROP COLUMN user_name;
CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    address VARCHAR(255),
    city VARCHAR(100),
    description TEXT,
    rating_avg FLOAT DEFAULT 0,
    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(50),
    price_per_night DECIMAL(10,2),
    hotel_id INT,
    capacity INT,
    quantity INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT,
    user_id bigint,
    check_in_date DATE,
    check_out_date DATE,
    total_price DECIMAL(10,2),
    status ENUM('PENDING','CONFIRMED','REJECTED','CANCELLED') DEFAULT 'PENDING',
    payment_status ENUM('UNPAID','PAID','REFUNDED') DEFAULT 'UNPAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE booking_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    room_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
CREATE TABLE booking_request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    type ENUM('CANCEL','CHANGE_DATE'),
    new_check_in DATE,
    new_check_out DATE,
    status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
    processed_by bigint,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);
CREATE TABLE room_image (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    image_url VARCHAR(255),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id bigint,
    hotel_id INT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);
SHOW ENGINE INNODB STATUS;
DESCRIBE users;