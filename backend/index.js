const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const pool = require('./database');
const jwt = require('jsonwebtoken');

// Secret key for signing the JWT
const secretKey = process.env.SECRET_KEY;

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

app.get('/', (req, res) => {
  const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const headers = req.headers;
  const connection = req.connection;
  console.log("headers:", headers);
  console.log("connection:", connection);
  
  res.send('Hello World!')
});


app.post('/getAttendSessionJWT', (req, res) => {
  const { rollNo } = req.body;
  
  const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  pool.query(
    `SELECT id, course_code FROM attendance_session WHERE teacher_ip=$1 AND attendance_on = true;`,
    [IP],
    (err, data) => {
      if (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (data.rows.length === 0) {
          res.json({ sessionExists: false, course_code: '', JWT: '' });
          return;
        }
        console.log("session details:", data.rows[0]);
        const course_code = data.rows[0].course_code;
        const attendance_session_id = data.rows[0].id;
        console.log("course_code:", course_code);
        console.log("attendance_session_id:", attendance_session_id);
        
        const JWT = jwt.sign({ rollNo, attendance_session_id }, secretKey, { expiresIn: '5m' });
        res.json({ sessionExists: true, course_code, JWT });
      }
    }
  );
});

app.post('/registerFace', verifyToken, (req, res) => {
  const { rollNo } = req;
  const { descriptor } = req.body;
  console.log('rollNo:', rollNo);
  console.log('descriptor:', descriptor);

  pool.query(
    `INSERT INTO face_recog_data (roll_no, face_recog_data) VALUES ($1, $2);`,
    [rollNo, descriptor],
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ status: 'Face Data Registered' });
    }
  );
});

app.post('/getFaceData', verifyToken, (req, res) => {
  const { rollNo } = req;
  console.log('rollNo in getFaceData:', rollNo);

  pool.query(
    `SELECT face_recog_data FROM face_recog_data WHERE roll_no=$1;`,
    [rollNo],
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      const faceData = data.rows;
      if (faceData.length === 0) {
        res.json({ status: 'No Face Data Found' });
        return;
      }
      res.json({ status: 'Face Data Found', faceData: data.rows });
    }
  );
});

app.post('/markAttendance', verifyToken, (req, res) => {
  const { rollNo, attendance_session_id } = req;
  console.log("rollNo:", rollNo)
  console.log("attendance_session_id :", attendance_session_id)

  pool.query(
    `WITH inserted_attendance AS (      
      INSERT INTO attendance (attendance_session_id, roll_no, marked_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)      
      RETURNING attendance_session_id, roll_no, marked_at
    )    
    SELECT 
      s.roll_no, 
      s.name, 
      a.course_code, 
      ia.marked_at    
    FROM 
      inserted_attendance ia    
    JOIN students s ON ia.roll_no = s.roll_no    
    JOIN attendance_session a ON ia.attendance_session_id = a.id;`,
    [attendance_session_id, rollNo],
    (err, data) => {
      if (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("Attendance Marked");
        console.log('data:', data.rows[0]);
        res.json({ data: data.rows[0] });
      }
    }
  );
});


app.post('/teacherLogin', (req, res) => {
  const { email } = req.body;
  console.log("email:", email);

  // (Possibly can check from Profs list)

  pool.query(
    'INSERT INTO teachers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING teacher_id',
    [email],
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      const teacher_id = data.rows[0].teacher_id;
      console.log("teacher_id:", teacher_id);
      
      const JWT = jwt.sign({ teacher_id }, secretKey, { expiresIn: '1d' });
      res.json(JWT);
    }
  );
});

app.post('/getMyCourses', verifyToken, (req, res) => {
  const { teacher_id } = req;
  
  pool.query(
    `SELECT course_code FROM course_teachers WHERE teacher_id=$1;`,
    [teacher_id],
    (err, data) => {
      if (err) {
        console.log(err.message);
        res.status(500).send('Internal Server Error');
      } else {
        console.log("backend:", data.rows);
        res.json(data.rows);
      }
    }
  );
});

app.post('/startAttendance', verifyToken, (req, res) => {
  const { teacher_id } = req;  
  const { course_code } = req.body;
  const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log("IP:", IP);
  console.log("course :", course_code);

  pool.query(
    `INSERT INTO attendance_session (course_code, teacher_ip, attendance_on, start_time, teacher_id)
     VALUES ($1, $2, true, CURRENT_TIMESTAMP, $3);`,
    [course_code, IP, teacher_id],
    (err, data) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("Attendance is started");
        res.json({ status: 'Attendance Started' });
      }
    }
  );
});

app.post('/stopAttendance', verifyToken, (req, res) => {
  const { teacher_id } = req;  
  const { course_code } = req.body;

  pool.query(
    `UPDATE attendance_session SET attendance_on = false WHERE course_code = $1 AND teacher_id = $2 AND attendance_on = true;`,
    [course_code, teacher_id],
    (err, data) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("Attendance is stopped");
        res.json({ status: 'Attendance Started' });
      }
    }
  );
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.rollNo = decoded.rollNo;
    req.attendance_session_id = decoded.attendance_session_id;
    req.teacher_id = decoded.teacher_id;

    console.log('rollNo:', req.rollNo);
    console.log('attendance_session_id:', req.attendance_session_id);
    console.log('teacher_id:', req.teacher_id);

    next();
  });
}

const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;