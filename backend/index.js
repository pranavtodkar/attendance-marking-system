const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const pool = require('./database');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

app.get('/', (req, res) => {  
  res.send('Hello World!');
});

app.post('/getAttendSessionJWT', (req, res) => {
  console.log("getAttendSessionJWT called at", new Date().toLocaleString());

  const { rollNo } = req.body;
  const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("rollNo:", rollNo);
  console.log("IP:", IP);  

  pool.query(
    `SELECT id, course_code FROM attendance_session WHERE teacher_ip=$1 AND attendance_on = true;`,
    [IP],
    (err, data) => {
      if (err) {
        console.log("Error in getAttendSessionJWT:", err.message);
        
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (data.rows.length === 0) {
        console.log("No active session found.");

        res.json({ sessionExists: false, course_code: '', JWT: '' });
        return;
      }
      const course_code = data.rows[0].course_code;
      const attendance_session_id = data.rows[0].id;
      console.log("course_code:", course_code);
      console.log("attendance_session_id:", attendance_session_id);
      
      const JWT = jwt.sign({ rollNo, attendance_session_id }, process.env.SECRET_KEY, { expiresIn: '5m' });
      res.json({ sessionExists: true, course_code, JWT });      
    }
  );
});

app.post('/registerFace', verifyToken, (req, res) => {
  console.log("registerFace called at", new Date().toLocaleString());

  const { rollNo } = req;
  const { descriptor } = req.body;
  console.log('rollNo:', rollNo);
  console.log('descriptor:', descriptor);

  pool.query(
    `INSERT INTO face_recog_data (roll_no, face_recog_data) VALUES ($1, $2);`,
    [rollNo, descriptor],
    (err, data) => {
      if (err) {
        console.error("Error in registerFace:", err.message);

        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json({ status: 'Face Data Registered' });
    }
  );
});

app.post('/getFaceData', verifyToken, (req, res) => {
  console.log("getFaceData called at", new Date().toLocaleString());

  const { rollNo } = req;
  console.log('rollNo:', rollNo);

  pool.query(
    `SELECT face_recog_data FROM face_recog_data WHERE roll_no=$1;`,
    [rollNo],
    (err, data) => {
      if (err) {
        console.error("Error in getFaceData:", err.message);

        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      const faceData = data.rows;
      if (faceData.length === 0) {
        console.log("No Face Data Found");

        res.json({ status: 'No Face Data Found' });
        return;
      }

      res.json({ status: 'Face Data Found', faceData: data.rows });
    }
  );
});

app.post('/markAttendance', verifyToken, (req, res) => {
  console.log("markAttendance called at", new Date().toLocaleString());

  const { rollNo, attendance_session_id } = req;
  console.log("rollNo:", rollNo)
  console.log("attendance_session_id:", attendance_session_id)

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
        console.error("Error in markAttendance:", err.message);

        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      console.log("Attendance Marked");
      console.log('data:', data.rows[0]);
      res.json({ data: data.rows[0] });    
    }
  );
});


app.post('/teacherLogin', (req, res) => {
  console.log("teacherLogin called at", new Date().toLocaleString());

  const { email } = req.body;
  console.log("email:", email);

  // (Possibly can check from Profs list)

  pool.query(
    'INSERT INTO teachers (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING teacher_id;',
    [email],
    (err, data) => {
      if (err) {
        console.error("Error in teacherLogin:", err.message);

        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      console.log("data:", data);
      const teacher_id = data.rows[0].teacher_id;
      console.log("teacher_id:", teacher_id);
      
      const JWT = jwt.sign({ teacher_id }, process.env.SECRET_KEY, { expiresIn: '1d' });
      res.json({ JWT });
    }
  );
});

app.post('/getMyCourses', verifyToken, (req, res) => {
  console.log("getMyCourses called at", new Date().toLocaleString());

  const { teacher_id } = req;
  console.log("teacher_id:", teacher_id);
  
  pool.query(
    `SELECT course_code FROM course_teachers WHERE teacher_id=$1;`,
    [teacher_id],
    (err, data) => {
      if (err) {
        console.error("Error in getMyCourses:", err.message);
        
        res.status(500).send('Internal Server Error');
      } else {
        const courses = data.rows;
        console.log("courses:", courses);

        res.json(courses);
      }
    }
  );
});

app.post('/startAttendance', verifyToken, (req, res) => {
  console.log("startAttendance called at", new Date().toLocaleString());

  const { teacher_id } = req;  
  const { course_code } = req.body;
  const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("teacher_id:", teacher_id);
  console.log("course_code:", course_code);
  console.log("IP:", IP);

  pool.query(
    `INSERT INTO attendance_session (course_code, teacher_ip, attendance_on, start_time, teacher_id)
     VALUES ($1, $2, true, CURRENT_TIMESTAMP, $3);`,
    [course_code, IP, teacher_id],
    (err, data) => {
      if (err) {
        console.error("Error in startAttendance:", err.message);

        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("Attendance started");

        res.json({ status: 'Attendance Started' });
      }
    }
  );
});

app.post('/stopAttendance', verifyToken, (req, res) => {
  console.log("stopAttendance called at", new Date().toLocaleString());

  const { teacher_id } = req;  
  const { course_code } = req.body;
  console.log("teacher_id:", teacher_id);
  console.log("course_code:", course_code);

  pool.query(
    `UPDATE attendance_session SET attendance_on = false WHERE course_code = $1 AND teacher_id = $2 AND attendance_on = true;`,
    [course_code, teacher_id],
    (err, data) => {
      if (err) {
        console.error("Error in stopAttendance:", err.message);

        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("Attendance stopped");

        res.json({ status: 'Attendance Started' });
      }
    }
  );
});

app.get('/getAttendance', (req, res) => {
  console.log("getAttendance called at", new Date().toLocaleString());
  
  const { email } = req.query;  
  console.log("email:", email);

  pool.query(
    `SELECT c.name AS course_code, s.name AS roll_no, a.marked_at
    FROM attendance a
    JOIN attendance_session ass ON a.attendance_session_id = ass.id
    JOIN courses c ON ass.course_code = c.course_code
    JOIN students s ON a.roll_no = s.roll_no
    JOIN teachers t ON ass.teacher_id = t.teacher_id
    WHERE t.email = $1;`,
    [email],
    (err, data) => {
      if (err) {
        console.error("Error in getAttendance:", err.message);

        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log("attendanceData:", data.rows);

        res.json(data.rows);
      }
    }
  );
});

function verifyToken(req, res, next) {
  console.log("Verifying JWT...");

  const token = req.headers.authorization;

  if (!token) {
    console.log("No JWT provided.");

    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Invalid JWT.");

      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.rollNo = decoded.rollNo;
    req.attendance_session_id = decoded.attendance_session_id;
    req.teacher_id = decoded.teacher_id;

    console.log("JWT Validated.");

    next();
  });
}

const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));

module.exports = app;