import React, { useState, useEffect } from 'react'
import Button from './Button'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';

const StartAttendance = () => {

   
    
    const location = useLocation();
    const teacher_id = location.state && location.state.teacher_id;
    console.log("teacher_id:", teacher_id);

    const details = {
      name: 'Hard Kapadia',
      teacherId: teacher_id,
      school: 'School of Computer Science'
    }

    const [courses, setCourses] = useState([]);    

    useEffect(() => {
      const getMyCourses = async () => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getMyCourses`,{
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({ teacher_id })
        });
        const courses = await res.json();
        console.log("listCourses:", courses);

        setCourses(courses);
      }
      getMyCourses();      
    }, []);       

    const [courseCode, setCourseCode] = useState(null);
    const handleSelectChange = (e) => {
        setCourseCode(e.target.value);
    };

    const beginAttendance = async () => {
      if(courseCode === null || courseCode === "") {
        toast.error("Please select a course");
        return;
      }
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/startAttendance`,{
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({ course_code : courseCode })
        }).then((res) => {
          toast.success("Attendance Started");
          console.log("Attendance Started");
        }).catch((err) => { 
          console.log(err);
        });
      
    }

    const stopAttendance = async () => {
      if(courseCode === null || courseCode === "") {
        toast.error("Please select a course");
        return;
      }
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/stopAttendance`,{
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({ course_code : courseCode })
        }).then((res) => {
          toast.success("Attendance Ended");
        }).catch((err) => { 
          console.log(err);
        });
    }
    
    return (
        <>
            <div className='flex gap-4 mt-10 mx-auto w-[45vh] items-center'>
                <div className='bg-[#d9d9d9] w-32 h-32'></div>
                <ul className='text-left items-center'>
                    <li><b className='text-[#002772]'>Name:</b> {details.name}</li>
                    <li><b className='text-[#002772]'>Teacher ID:</b> {details.teacherId} </li>
                    <li><b className='text-[#002772]'>School :</b> {details.school}</li>
                    <li><b className='text-[#002772]'>Date:</b> XX/XX/2024</li>
                </ul>
            </div>
            <div className="flex flex-col items-center mt-40">
                <div>                    
                    <select className='border-2 border-[#0049d9] w-80 h-11 my-2 rounded-lg pl-2' id="course" value={courseCode} onChange={handleSelectChange}>
                        <option value="">Select a course</option>
                        {courses && courses.map((it, index) => (
                            <option key={index} value={it.course_code}>
                                {it.course_code}
                            </option>
                        ))}
                    </select>
                </div>
                <button  onClick={beginAttendance} className='w-80 h-11 my-2 rounded-lg text-white bg-[#046D28]'>Start Attendance</button>
                <button onClick={stopAttendance} className='w-80 h-11 my-2 rounded-lg text-white bg-[#FF0000]'>Stop Attendance</button>
                <Button value='Home' css='bg-white text-[#0049d9] border-2' dst='faculty' ></Button>
            </div>

        </>
    )
}

export default StartAttendance


