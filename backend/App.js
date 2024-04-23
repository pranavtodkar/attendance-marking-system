const express = require('express');
//const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();

const { Client } = require('pg')

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "1234",
  database: "attendance-marking"
})
client.connect();

const app = express();

//app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.post('/getFaceData', (req, res) => {
    const { rollNo } = req.body;
    
    client.query(`SELECT face_recog_data FROM face_recog_data WHERE roll_no=${rollNo};`, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const faceData = data.rows;

      if(faceData.length === 0) {
        res.json({ status: 'No Face Data Found' });
        return;
      }
      
      res.json({ status: 'Face Data Found', faceData: data.rows });
    });
  });

  app.post('/registerFace', (req, res) => {
    const { rollNo, descriptor } = req.body;
    console.log('rollNo:', rollNo);
    console.log('descriptor:', descriptor);
    
    client.query(`INSERT INTO face_recog_data (roll_no, face_recog_data) VALUES (${rollNo}, '${descriptor}');`, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      
      res.json({ status: 'Face Data Registered' });
    });
  });


app.post('/getMyCourses', (req, res) => {
  const { teacher_id } = req.body
  console.log("teacher_id:", teacher_id)
  client.query(`SELECT course_code FROM course_teachers WHERE teacher_id=${teacher_id};`, (err, data) => {
    if (!err) {
      console.log("backend:", data.rows)
      res.json(data.rows)
    }
    else {
      console.log(err.message)
      res.statusCode("500")
    }
  });
});

app.post('/startAttendance', (req, res) => {
  const { teacher_ip , course_code } = req.body
  console.log("teacher_ip:", teacher_ip)
  console.log("course :", course_code)
  client.query(`insert into public.attendance_session (course_code, teacher_ip, attendance_on , start_time) VALUES ('${course_code}','${teacher_ip}' , true, CURRENT_TIMESTAMP);`, (err, data) => {
    if (!err) {
      console.log("Attendance is started")
    }
    else {
      console.log(err.message)
      
    }
  });
});

app.post('/stopAttendance', (req, res) => {
  const { course_code } = req.body
  client.query(`UPDATE attendance_session SET attendance_on = false WHERE course_code = '${course_code}' AND attendance_on = true;`, (err, data) => {
    if (!err) {
      console.log("Attendance is stopped")
    }
    else {
      console.log(err.message)
      
    }
  });
});

app.post('/getAttendSession', (req, res) => {
  const { student_ip } = req.body
  console.log("student_ip:", student_ip)
  client.query(`SELECT id FROM attendance_session WHERE teacher_ip='${student_ip}' AND attendance_on = true;`, (err, data) => {
    if (!err) {
      console.log("id:", data.rows[0])
      res.json(data.rows[0])
    }
    else {
      console.log(err.message)
      //res.statusCode("500")
    }
  });
});

app.post('/markAttendance', (req, res) => {
  const { roll_no , attendance_session_id } = req.body
  console.log("roll_no:", roll_no)
  console.log("attendance_session_id :", attendance_session_id)
  client.query(`INSERT INTO attendance (attendance_session_id, roll_no, marked_at) VALUES (${attendance_session_id}, ${roll_no}, CURRENT_TIMESTAMP);`, (err, data) => {
    if (!err) {
      console.log("Attendance Marked")
    }
    else {
      console.log(err.message)
    }
  });
});



const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));

