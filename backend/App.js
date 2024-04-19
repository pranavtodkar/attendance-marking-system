const express = require('express');
//const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();

const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "4304",
    database: "attendance-marking"
})
client.connect();

const app = express();

//app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.post ('/getFaceData', (req, res) => {
    const roll_no = req.body.rollNo
    console.log("body:", roll_no)
    client.query(`SELECT face_recog_data FROM face_recog_data WHERE roll_no=${roll_no};`, (err,data)=>{
      if(!err){
        console.log(data.rows)
        res.json(data.rows)
      }
      else{
          console.log(err.message)
      }
  });
});

app.post ('/getMyCourses', (req, res) => {
  const {teacher_id } = req.body
  console.log("teacher_id:", teacher_id)
  client.query(`SELECT course_code FROM course_teachers WHERE teacher_id=${teacher_id};`, (err,data)=>{
    if(!err){
      console.log("backend:", data.rows)
      res.json(data.rows)
    }
    else{
        console.log(err.message)
        res.statusCode("500")
    }
});
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));