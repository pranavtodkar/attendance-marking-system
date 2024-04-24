-- Insert data into students
INSERT INTO students (roll_no, name)
VALUES
    (2206316, 'Kashvi Aggarwal'),
    (2206315, 'Hard Kapadia'),
    (2203303, 'Adwita Deshpande'),
    (2203312, 'Lakshay Khuarana');

-- Insert data into teachers
INSERT INTO teachers (name)
VALUES
    ('Mantu Santra'),
    ('Raja Mitra'),
    ('Sandipan De'),
    ('Clint George');

-- Insert data into courses
INSERT INTO courses (course_code, name)
VALUES
    ('CH102', 'Biochemistry'),
    ('CH102', 'Chemical physics'), -- Duplicate course_code, should be unique
    ('CH103', 'Geochemistry'),
    ('CH104', 'Material science');

-- Insert data into course_registrations
INSERT INTO course_registrations (course_code, roll_no)
VALUES
    ('CH102', 2206316),
    ('CH102', 2206315),
    ('CH103', 2203303),
    ('CH104', 2203312);

-- Insert data into course_teachers
INSERT INTO course_teachers (course_code, teacher_id)
VALUES
    ('CH102', 1),
    ('CH102', 2),
    ('CH103', 3),
    ('CH104', 4);