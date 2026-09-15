-- CampusConnect Database Schema V1 Migration Script (Flyway Managed)

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    university VARCHAR(100),
    college VARCHAR(255),
    branch VARCHAR(100),
    graduation_year VARCHAR(50),
    semester VARCHAR(50),
    cgpa DOUBLE PRECISION,
    target_role VARCHAR(100),
    resume_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS student_profile_skills (
    student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    skills VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS regulations (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS subjects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    regulation_code VARCHAR(50) NOT NULL,
    academic_year VARCHAR(50),
    semester VARCHAR(50),
    branch VARCHAR(50),
    regulation_tag VARCHAR(50),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS units (
    id BIGSERIAL PRIMARY KEY,
    unit_num INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id BIGINT REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resources (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    url TEXT,
    unit_id BIGINT REFERENCES units(id) ON DELETE CASCADE,
    verified BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS placement_resources (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    badge VARCHAR(100),
    badge_color VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    desc_text TEXT,
    difficulty VARCHAR(50),
    hours VARCHAR(50),
    problems VARCHAR(50),
    color VARCHAR(50),
    light_color VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS placement_resource_topics (
    placement_resource_id VARCHAR(100) NOT NULL REFERENCES placement_resources(id) ON DELETE CASCADE,
    topics VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS placement_resource_companies (
    placement_resource_id VARCHAR(100) NOT NULL REFERENCES placement_resources(id) ON DELETE CASCADE,
    companies VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    logo VARCHAR(100),
    color VARCHAR(50),
    bg_color VARCHAR(50),
    industry VARCHAR(100),
    website TEXT,
    verified BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    logo VARCHAR(50),
    color VARCHAR(50),
    bg_color VARCHAR(50),
    location VARCHAR(255),
    work_mode VARCHAR(50),
    type VARCHAR(50),
    category VARCHAR(50),
    batch VARCHAR(50),
    experience VARCHAR(50),
    salary VARCHAR(100),
    posted_date VARCHAR(100),
    deadline VARCHAR(100),
    verified BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    short_desc TEXT,
    description TEXT,
    external_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_branch (
    job_id VARCHAR(100) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    branch VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS job_skills (
    job_id VARCHAR(100) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skills VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS job_responsibilities (
    job_id VARCHAR(100) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    responsibilities TEXT
);

CREATE TABLE IF NOT EXISTS job_requirements (
    job_id VARCHAR(100) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    requirements TEXT
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_bookmark UNIQUE (user_email, target_type, target_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_subjects_reg ON subjects(regulation_code);
CREATE INDEX IF NOT EXISTS idx_units_subject ON units(subject_id);
CREATE INDEX IF NOT EXISTS idx_resources_unit ON resources(unit_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(active);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_email);
