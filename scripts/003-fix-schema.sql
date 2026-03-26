-- Fix schema to match application expectations

-- Drop existing tables and recreate with correct structure
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS concepts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create concepts table
CREATE TABLE concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    prerequisites TEXT[] DEFAULT ARRAY[]::TEXT[],
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create progress table
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, concept_id)
);

-- Create submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    feedback TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_concept_id ON progress(concept_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_concept_id ON submissions(concept_id);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);

-- Seed programming concepts
INSERT INTO concepts (title, description, difficulty, prerequisites, order_index) VALUES
-- Beginner concepts
('Variables', 'Understanding how to declare and use variables to store data in memory. Learn about naming conventions and best practices.', 'beginner', ARRAY[]::TEXT[], 1),
('Data Types', 'Learning about different data types: strings, numbers, booleans, null, and undefined. Understanding type coercion.', 'beginner', ARRAY['Variables']::TEXT[], 2),
('Operators', 'Using arithmetic, comparison, and logical operators to manipulate data and make decisions.', 'beginner', ARRAY['Variables', 'Data Types']::TEXT[], 3),
('Control Flow', 'Using if/else statements and switch cases to control program flow based on conditions.', 'beginner', ARRAY['Operators']::TEXT[], 4),
('Loops', 'Understanding for loops, while loops, and iteration patterns to repeat actions.', 'beginner', ARRAY['Control Flow']::TEXT[], 5),

-- Intermediate concepts
('Functions', 'Creating reusable code blocks with parameters and return values. Understanding scope and closures.', 'intermediate', ARRAY['Variables', 'Control Flow']::TEXT[], 6),
('Arrays', 'Working with ordered collections of data. Array methods like map, filter, reduce.', 'intermediate', ARRAY['Loops', 'Functions']::TEXT[], 7),
('Objects', 'Understanding key-value pairs, object-oriented concepts, and working with complex data structures.', 'intermediate', ARRAY['Arrays', 'Functions']::TEXT[], 8),

-- Advanced concepts
('Recursion', 'Solving problems by having functions call themselves. Understanding base cases and recursive cases.', 'advanced', ARRAY['Functions']::TEXT[], 9),
('Sorting Algorithms', 'Understanding and implementing sorting algorithms like bubble sort, merge sort, and quicksort.', 'advanced', ARRAY['Arrays', 'Recursion']::TEXT[], 10),
('Tree Data Structures', 'Implementing and traversing binary trees, BSTs, and understanding tree-based algorithms.', 'advanced', ARRAY['Objects', 'Recursion']::TEXT[], 11);
