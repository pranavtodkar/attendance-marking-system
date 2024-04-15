
client.query(`Select * from face_recog_data`, (err,res)=>{
    if(!err){
        console.log(res.rows)
    }
    else{
        console.log(err.message)
    }
    client.end;
})