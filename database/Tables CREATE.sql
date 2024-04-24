-- Create the students table
CREATE TABLE students (
    roll_no INTEGER PRIMARY KEY,
    name VARCHAR
);

-- Create the face_recog_data table
CREATE TABLE face_recog_data (
    id SERIAL PRIMARY KEY,
    roll_no INTEGER REFERENCES students(roll_no),
    face_recog_data VARCHAR
);

-- Create the courses table
CREATE TABLE courses (
    course_code VARCHAR PRIMARY KEY,
    name VARCHAR
);

-- Create the teachers table
CREATE TABLE teachers (
    teacher_id SERIAL PRIMARY KEY,
    name VARCHAR
);

-- Create the course_teachers table
CREATE TABLE course_teachers (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(teacher_id),
    course_code VARCHAR REFERENCES courses(course_code)
);

-- Create the course_registrations table
CREATE TABLE course_registrations (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR REFERENCES courses(course_code),
    roll_no INTEGER REFERENCES students(roll_no)
);

-- Create the attendance_session table
CREATE TABLE attendance_session (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR REFERENCES courses(course_code),
    start_time TIMESTAMP,
    teacher_ip VARCHAR,
    attendance_on BOOLEAN
);

-- Create the attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    attendance_session_id INTEGER REFERENCES attendance_session(id),
    roll_no INTEGER REFERENCES students(roll_no),
    marked_at TIMESTAMP
);