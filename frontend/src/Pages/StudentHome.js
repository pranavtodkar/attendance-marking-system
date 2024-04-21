import { React , useEffect, useState } from 'react';
import image from './logo.jpg'
import Button from './Button.js'
import { Link, useNavigate } from 'react-router-dom';


function StudentHome() 
{
  const navigate = useNavigate();
  const studentIp = "10.196.35.24";
  const [rollNo, setRollNo] = useState();
  // useEffect( async ()=>{
  //   const res = await fetch("http://localhost:8080/getAttendSession",{
  //     method: 'POST',
  //     headers:{
  //       'Content-Type' : 'application/json',
  //     },
  //     body: JSON.stringify({studentIp})
  //   });
  //   const data = await res.json();
  //   console.log(data);
  // }, []);

  const onMark = async () => {
    console.log(rollNo)
    const res = await fetch("http://localhost:8080/getFaceData",{
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({rollNo})
    });
    const face_data = await res.json();
    console.log(face_data)
    setRollNo("")
    const response = await fetch("http://localhost:8080/getAttendSession",{
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({student_ip : studentIp})
    });
    const id = await response.json();
    console.log(id.id);
    navigate('/verify', { state: {id,rollNo,face_data} });
  }


  const handleChange = (e) =>{
    setRollNo(e.target.value)  
  }
  
  return (
    <>
      <div className="logo m-100 flex justify-center mt-40 ">
        <img width = "175px" height = "183px" src = {image} alt="" />
      </div>
      <div className="mt-8">
        <form>
          <input value = {rollNo} onChange={handleChange} className='border-2 border-[#0049d9] w-80 h-11 my-2 rounded-lg pl-2' type='text' placeholder='Enter Roll No. '></input>
        </form>
        <Button css = 'text-white bg-[#0049d9]' value='Mark Attendance' redirect = {onMark} dst = "" ></Button>
        
      </div>
    </>
  );
}

export default StudentHome;
