-- CampusConnect Database Schema V2 Migration Script: Placement System

CREATE TABLE IF NOT EXISTS cc_placement_tracks (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    category VARCHAR(50),
    stage VARCHAR(50),
    description VARCHAR(1000),
    difficulty VARCHAR(50),
    estimated_hours VARCHAR(50),
    icon VARCHAR(50),
    color VARCHAR(50),
    light_color VARCHAR(50),
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS cc_placement_track_target_companies (
    placement_track_id BIGINT NOT NULL REFERENCES cc_placement_tracks(id) ON DELETE CASCADE,
    target_companies VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS cc_placement_modules (
    id BIGSERIAL PRIMARY KEY,
    track_id BIGINT NOT NULL REFERENCES cc_placement_tracks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cc_placement_topics (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL REFERENCES cc_placement_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    concept_summary VARCHAR(2000),
    practice_type VARCHAR(50),
    difficulty VARCHAR(50),
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cc_placement_questions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    track_slug VARCHAR(50),
    difficulty VARCHAR(50),
    description VARCHAR(2000),
    sample_input VARCHAR(1000),
    sample_output VARCHAR(1000),
    solution_notes VARCHAR(3000),
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cc_placement_question_companies (
    placement_question_id BIGINT NOT NULL REFERENCES cc_placement_questions(id) ON DELETE CASCADE,
    companies VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS cc_placement_progress (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    track_slug VARCHAR(50) NOT NULL,
    topic_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP,
    CONSTRAINT uk_user_topic UNIQUE (user_email, topic_id)
);
