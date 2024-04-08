const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "1234",
    database: "attendanceMarkingSystem"
})

client.connect();

client.query(`Select * from students`, (err, res)=>{
    if(!err){
        console.log(res.rows);
    }
    else{
        console.log(err.message);
    }
    client.end;
})