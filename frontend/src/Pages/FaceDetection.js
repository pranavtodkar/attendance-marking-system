import React from 'react'
import Button from './Button';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

const FaceDetection = () => {
  const location = useLocation();
  const id = location.state && location.state.id;
  console.log("id:", id);
  const roll_no = location.state && location.state.rollNo;
  console.log("rollno:", roll_no);
  const face_data = location.state && location.state.face_data;
  console.log("faceData:", face_data);
  const markAttendance = async ()=> {
    
      await fetch("http://localhost:8080/markAttendance",{
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify(
            {
              roll_no: roll_no,
              attendance_session_id : id.id,
            }
          )
        });
  }
  
  

  
  return (
    <div className='h-fit'>
        <div className='mt-10 mb-5 w-[40vh] m-auto'>
          <Link to='/marked'><div onClick={markAttendance} className='h-[70vh] bg-[#d9d9d9]'></div></Link>
          <h4 className=' text-left'>Please wait...</h4>
        </div>
        <a href='/verify'><button className='text-white bg-[#0049d9] w-80 h-11 my-2 rounded-lg'>Retry</button></a>
        <Button css='bg-white text-[#0049d9] border-2' value='Home' redirect = {()=>{}} dst=''></Button>
    </div>
  )
}

export default FaceDetection