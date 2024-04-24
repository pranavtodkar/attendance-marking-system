import { React , useState } from 'react';
import image from '../images/logo.jpg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function StudentHome() {
  const navigate = useNavigate();

  const [rollNo, setRollNo] = useState();

  const getAttendSessionJWT = async (e) =>{
    e.preventDefault();
    if(rollNo === null || rollNo === undefined){
      toast.error("Please enter Roll No.");
      return;
    }

    console.log('rollNo:', rollNo);

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getAttendSessionJWT`,{
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json'        
      },
      body: JSON.stringify({ rollNo })
    });

    const { sessionExists, course_code, JWT } = await res?.json();

    if(!sessionExists){
      toast.error("No Attendance Ongoing");
      return;
    }

    localStorage.setItem('JWT', JWT);
    toast.success(`${course_code} Attendance`);

    navigate('/facedetection');
  }

  const handleChange = (e) =>{
    setRollNo(e.target.value === "" ? null : e.target.value);  
  }

  
  return (
    <>
      <div className="logo m-100 flex justify-center mt-40 ">
        <img width = "175px" height = "183px" src = {image} alt="" />
      </div>
      <div className="mt-8">
        <form onSubmit={getAttendSessionJWT}>
          <input
            value={rollNo} onChange={handleChange} className="border-2 border-[#0049d9] w-80 h-11 my-2 rounded-lg pl-2" type="text" placeholder="Enter Roll No."
          />
          <button
            type="submit"
            className={`text-white bg-[#0049d9] w-80 h-11 my-2 rounded-lg`}
          >
            Mark Attendance
          </button>
        </form>        
      </div>
    </>
  );
}

export default StudentHome;
