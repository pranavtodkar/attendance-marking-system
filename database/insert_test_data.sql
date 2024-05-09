-- Insert data into students
INSERT INTO students (roll_no, name)
VALUES
    (2206316, 'Kashvi Aggarwal'),
    (2206315, 'Hard Kapadia'),
    (2203303, 'Adwita Deshpande'),
    (2203312, 'Lakshay Khuarana');

-- Insert data into courses
INSERT INTO courses (course_code, name)
VALUES
    ('CH102', 'Biochemistry'),
    ('CH103', 'Geochemistry'),
    ('CH104', 'Material science');

-- Insert data into course_teachers
INSERT INTO course_teachers (course_code, teacher_id)
VALUES
    ('CH102', 1), -- First do faculty login and then put teacher_id of according to the teachers table
    ('CH102', 2), -- First do faculty login and then put teacher_id of according to the teachers table
    ('CH103', 3), -- First do faculty login and then put teacher_id of according to the teachers table
    ('CH104', 4); -- First do faculty login and then put teacher_id of according to the teachers table