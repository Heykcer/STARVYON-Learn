-- ==============================================================================
-- STARVYON Learn - Master PostgreSQL Schema (Neon Database)
-- ==============================================================================
-- Designed for Neon Serverless Postgres.
-- Handles learners (users), continuous progression, and fine-grained activity telemetry.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(64) DEFAULT 'Student Fellow',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- 3. USER ACTIVITIES TABLE (Telemetry & Audit Log)
-- Tracks actions: USER_REGISTERED, USER_LOGIN, USER_LOGOUT,
-- TOPIC_COMPLETED, TOPIC_UNCOMPLETED, QUIZ_SUBMITTED, LAB_INTERACTED, etc.
CREATE TABLE IF NOT EXISTS user_activities (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(64) NOT NULL,
    course_id VARCHAR(64),
    topic_id VARCHAR(64),
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_course ON user_activities(course_id);

-- 4. USER PROGRESS TABLE (Aggregated Course & Topic Mastery State)
CREATE TABLE IF NOT EXISTS user_progress (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL,
    topic_id VARCHAR(64) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER DEFAULT 0,
    quiz_total INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_course_topic UNIQUE (user_id, course_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lookup ON user_progress(user_id, course_id);

-- 5. USER ACTIVITY SUMMARY VIEW (For Fast Radar & Progress Stats)
CREATE OR REPLACE VIEW user_activity_summaries AS
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    u.role,
    COUNT(DISTINCT a.id) AS total_activities_logged,
    COUNT(DISTINCT CASE WHEN a.activity_type = 'TOPIC_COMPLETED' THEN a.topic_id END) AS topics_completed_count,
    COUNT(DISTINCT CASE WHEN a.activity_type = 'QUIZ_SUBMITTED' THEN a.id END) AS quizzes_attempted_count,
    COUNT(DISTINCT CASE WHEN a.activity_type = 'LAB_INTERACTED' THEN a.id END) AS lab_interactions_count,
    MAX(a.created_at) AS last_activity_at,
    u.created_at AS member_since
FROM users u
LEFT JOIN user_activities a ON u.id = a.user_id
GROUP BY u.id, u.name, u.email, u.role, u.created_at;

-- 6. DEFAULT SEED USER (Matches demo student credentials)
INSERT INTO users (id, name, email, password_hash, role, created_at)
VALUES (
    'usr_seed_01',
    'Alex Vance',
    'engineer@starvyon.internal',
    'starvyon123',
    'AI Systems Fellow',
    '2026-10-01T08:00:00Z'
)
ON CONFLICT (email) DO NOTHING;

-- Seed initial welcome activity for default user
INSERT INTO user_activities (id, user_id, activity_type, course_id, details)
VALUES (
    'act_seed_01',
    'usr_seed_01',
    'USER_REGISTERED',
    NULL,
    '{"platform": "STARVYON Learn", "source": "Curriculum Seed"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
