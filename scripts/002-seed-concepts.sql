-- Seed programming concepts for NeuroPath AI
INSERT INTO concepts (name, description, difficulty, category) VALUES
-- Beginner concepts
('Variables', 'Understanding how to declare and use variables to store data', 'beginner', 'Fundamentals'),
('Data Types', 'Learning about different data types: strings, numbers, booleans', 'beginner', 'Fundamentals'),
('Operators', 'Using arithmetic, comparison, and logical operators', 'beginner', 'Fundamentals'),
('Conditional Statements', 'Using if/else statements to control program flow', 'beginner', 'Control Flow'),
('Loops', 'Understanding for loops, while loops, and iteration', 'beginner', 'Control Flow'),

-- Intermediate concepts
('Functions', 'Creating reusable code blocks with parameters and return values', 'intermediate', 'Functions'),
('Arrays', 'Working with ordered collections of data', 'intermediate', 'Data Structures'),
('Objects', 'Understanding key-value pairs and object-oriented concepts', 'intermediate', 'Data Structures'),
('Error Handling', 'Using try/catch blocks to handle exceptions', 'intermediate', 'Error Handling'),
('Asynchronous Programming', 'Working with promises, async/await, and callbacks', 'intermediate', 'Async'),

-- Advanced concepts
('Recursion', 'Solving problems by having functions call themselves', 'advanced', 'Algorithms'),
('Algorithms', 'Understanding sorting, searching, and optimization techniques', 'advanced', 'Algorithms'),
('Data Structures', 'Implementing stacks, queues, trees, and graphs', 'advanced', 'Data Structures'),
('Design Patterns', 'Common solutions to recurring software design problems', 'advanced', 'Architecture'),
('System Design', 'Architecting scalable and maintainable applications', 'advanced', 'Architecture')

ON CONFLICT DO NOTHING;
