import { React , useState } from 'react';
import image from './logo.jpg'
import { Link } from 'react-router-dom';

function StudentHome() 
{
  const [rollNo, setRollNo] = useState();

  const handleChange = (e) =>{
    setRollNo(e.target.value)  
  }

  // Pending: Allow only if connected to existing Attendance Session (Check by IP)
  
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
