const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.post('/', (req, res) => {
    // const {rollno} = req.body
    console.log("body:", req.body)
    res.send('Hello World!')
})
  
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));