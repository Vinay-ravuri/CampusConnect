-- CampusConnect Database Schema V4 Migration: AI Career Center Entities

CREATE TABLE IF NOT EXISTS cc_resume_analyses (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    target_role VARCHAR(255),
    overall_score INT,
    ats_score INT,
    result_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cc_skill_assessments (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    overall_score INT,
    technical_score INT,
    communication_score INT,
    result_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cc_mock_interviews (
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    interview_type VARCHAR(50),
    difficulty VARCHAR(50),
    duration_minutes INT,
    overall_score INT,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    questions_json TEXT,
    answers_json TEXT,
    evaluation_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
