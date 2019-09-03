DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL primary key,
    first VARCHAR(255),
    last VARCHAR(255),
    email VARCHAR (255) UNIQUE,
    password text,
    avatarUrl text,
    bio text,
    instrument VARCHAR (100),
    band VARCHAR (100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS friendships;
CREATE TABLE friendships (
    id SERIAL primary key,
    sender_id INT,
    receiver_id INT,
    accepted BOOLEAN DEFAULT false
);
DROP TABLE IF EXISTS chatMessages;
CREATE TABLE chatMessages (
    id SERIAL primary key,
    sender_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS privateMessages;
CREATE TABLE privateMessages (
    id SERIAL primary key,
    sender_id INT,
    receiver_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    seen BOOLEAN DEFAULT true
);
