-- CampusConnect Database Schema V3 Migration: Saved Jobs & Job Applications

CREATE TABLE IF NOT EXISTS cc_saved_jobs (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    job_id VARCHAR(255) NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_saved_job UNIQUE (user_email, job_id)
);

CREATE TABLE IF NOT EXISTS cc_job_applications (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    job_id VARCHAR(255) NOT NULL,
    student_name VARCHAR(255),
    student_email VARCHAR(255),
    resume_url VARCHAR(500),
    cover_note VARCHAR(2000),
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_job_application UNIQUE (user_email, job_id)
);
