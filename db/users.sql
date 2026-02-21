-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Enum de roles
CREATE TYPE role_type AS ENUM (
    'customer',
    'cashier',
    'stocker',
    'admin'
);
-- Tabla users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name     TEXT NOT NULL,
    s_name   TEXT,
    l_name   TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email    TEXT NOT NULL UNIQUE,
    phone    TEXT NOT NULL UNIQUE,
    v_email  BOOLEAN NOT NULL DEFAULT FALSE,
    v_phone  BOOLEAN NOT NULL DEFAULT FALSE,
    role     role_type NOT NULL DEFAULT 'customer',
    deleted  BOOLEAN NOT NULL DEFAULT FALSE
);