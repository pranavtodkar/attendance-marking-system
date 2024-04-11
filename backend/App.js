const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(cors({origin: true, credentials: true}));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Server is running on port ${port}`));