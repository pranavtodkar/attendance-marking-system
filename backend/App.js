const express = require('express');
const morgan = require('morgan');
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

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

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



const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));