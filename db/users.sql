-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE role_type AS ENUM (
    'customer',
    'cashier',
    'admin'
);

CREATE TYPE user_status AS ENUM (
    'pending',
    'complete'
);

CREATE TYPE sex_type AS ENUM (
    'male',
    'female',
    'other'
);

-- ============================================================
-- TABLE: users
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name      TEXT NOT NULL,
    s_name    TEXT,
    l_name    TEXT NOT NULL,

    sex       sex_type NOT NULL,

    username  TEXT NOT NULL UNIQUE,
    password  TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE,
    phone     TEXT NOT NULL UNIQUE,

    v_email   BOOLEAN NOT NULL DEFAULT FALSE,
    v_phone   BOOLEAN NOT NULL DEFAULT FALSE,

    status    user_status NOT NULL DEFAULT 'pending',

    role      role_type NOT NULL DEFAULT 'customer',

    banned    BOOLEAN NOT NULL DEFAULT FALSE,
    banned_at TIMESTAMPTZ,

    deleted   BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);