import React from 'react'
import Button from './Button'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

const StartAttendance = () => {
    const teacherIp = "10.196.35.24";
    
    const location = useLocation();
    const courses = location.state && location.state.courses;
    console.log("courses:", courses);

    const [courseName, setCourseName] = useState(null);

    const handleSelectChange = (e) => {

        setCourseName(e.target.value);
        console.log(courseName)
    };

    const beginAttendance = async () => {
        await fetch("http://localhost:8080/startAttendance",{
            method: 'POST',
            headers:{
              'Content-Type' : 'application/json',
            },
            body: JSON.stringify(
              {
                teacher_ip: teacherIp,
                course_code : courseName,
              }
            )
          });
    }

    const stopAttendance = async () => {
        await fetch("http://localhost:8080/stopAttendance",{
            method: 'POST',
            headers:{
              'Content-Type' : 'application/json',
            },
            body: JSON.stringify(
              {
                
                course_code : courseName,
              }
            )
          });
    }
    
    

    const details = {
        name: 'Hard Kapadia',
        userName: 2206316,
        school: 'School of Computer Science'
    }
    return (
        <>
            <div className='flex gap-4 mt-10 mx-auto w-[45vh] items-center'>
                <div className='bg-[#d9d9d9] w-32 h-32'></div>
                <ul className='text-left items-center'>
                    <li><b className='text-[#002772]'>Name:</b> {details.name}</li>
                    <li><b className='text-[#002772]'>UserName:</b> {details.userName} </li>
                    <li><b className='text-[#002772]'>School :</b> {details.school}</li>
                    <li><b className='text-[#002772]'>Date:</b> XX/XX/2024</li>
                </ul>
            </div>
            <div className="flex flex-col items-center mt-40">
                {/* <input className='border-2 border-[#0049d9] w-80 h-11 my-2 rounded-lg pl-2' type='text' placeholder='Course Code'></input> */}
                <div>
                    
                    <select className='border-2 border-[#0049d9] w-80 h-11 my-2 rounded-lg pl-2' id="course" value={courseName} onChange={handleSelectChange}>
                        <option value="">Select a course</option>
                        {courses.map((it, index) => (
                            <option key={index} value={it.course_code}>
                                {it.course_code}
                            </option>
                        ))}
                    </select>
                </div>
                <button  onClick={beginAttendance} className='w-80 h-11 my-2 rounded-lg text-white bg-[#046D28]'>Start Attendance</button>
                <button onClick={stopAttendance} className='w-80 h-11 my-2 rounded-lg text-white bg-[#FF0000]'>Stop Attendance</button>
                <Button value='Home' css='text-white bg-[#0049d9]' dst='admin' ></Button>
            </div>

        </>
    )
}

export default StartAttendance


