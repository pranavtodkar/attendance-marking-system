import { React , useState } from 'react';
import image from './logo.jpg'
import { Link } from 'react-router-dom';

function StudentHome() 
{
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

        <Link 
          to="/verify"
          state={{rollNo}}
        >
          <button className={`text-white bg-[#0049d9] w-80 h-11 my-2 rounded-lg`} > Mark Attendance </button>
        </Link>
        
      </div>
    </>
  );
}

export default StudentHome;
