const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "kashvi05",
    database: "attendance-marking"
})

client.connect();

client.query(`Select * from students`, (err,res)=>{
    if(!err){
        console.log(res.rows)
    }
    else{
        console.log(err.message)
    }
    client.end;
})

client.query(`Select * from face_recog_data`, (err,res)=>{
    if(!err){
        console.log(res.rows)
    }
    else{
        console.log(err.message)
    }
    client.end;
})