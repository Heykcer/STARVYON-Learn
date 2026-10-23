# STARVYON Learn — Database Architecture & Setup (Neon PostgreSQL)

This directory contains the database schema, migration scripts, and documentation for **STARVYON Learn**.

The database runs on **Neon Serverless PostgreSQL** to handle:
1. **Users (`users`)**: Student and Fellow accounts, roles, authentication credentials, and timestamps.
2. **User Activities (`user_activities`)**: Fine-grained telemetry and event auditing (login, topic completions, diagnostic quiz attempts, interactive lab runs).
3. **User Progress (`user_progress`)**: Persistent mastery markers and quiz scores per course and module topic.
4. **Activity Summary View (`user_activity_summaries`)**: Fast aggregations for learner profiles and progress radar charts.

---

## Quick Setup Guide

### Step 1: Create your Neon PostgreSQL Database
1. Go to [https://console.neon.tech](https://console.neon.tech) and sign in.
2. Create a new project (e.g. `starvyon-learn-db`).
3. Under **Dashboard > Connection Details**, copy your Postgres connection string:
   ```
   postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require
   ```

### Step 2: Configure `.env`
Create a `.env` file in the project root (or copy from `.env.example`):
```bash
cp .env.example .env
```
Paste your Neon connection string into `.env`:
```env
NEON_DATABASE_URL=postgresql://alex:AbCdEf123@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
NEON_API_KEY=your-neon-api-key-optional
```

### Step 3: Run One-Click Database Provisioning
Run the setup script:
```bash
npm run db:setup
```
*(Alternatively: `node scripts/setup-db.js`)*

This script connects directly to Neon over HTTPS and applies [`db/schema.sql`](file:///c:/Users/Tanjil%20Alam/Desktop/Projects/STARVYON-Learn/db/schema.sql) to create all tables, indexes, constraints, views, and seed data.

### Step 4: Verify Database Connectivity
```bash
npm run db:test
```

---

## Operating Modes

| Mode | Trigger | Description |
| :--- | :--- | :--- |
| **Local Mock Mode** *(Default)* | `NEON_DATABASE_URL` is empty | Automatically falls back to high-fidelity client storage (`localStorage`). No crashes, zero config required for local exploration. |
| **Neon Live Mode** | `NEON_DATABASE_URL` is populated | Connects to Neon Serverless Postgres via HTTP SQL endpoints. All user accounts and activities sync live to your cloud database. |

---

## Schema Overview

```sql
users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(64) DEFAULT 'Student Fellow',
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE
)

user_activities (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    activity_type VARCHAR(64) NOT NULL, -- USER_REGISTERED, USER_LOGIN, TOPIC_COMPLETED, QUIZ_SUBMITTED, etc.
    course_id VARCHAR(64),
    topic_id VARCHAR(64),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE
)

user_progress (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id),
    course_id VARCHAR(64) NOT NULL,
    topic_id VARCHAR(64) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER,
    quiz_total INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id, topic_id)
)
```
