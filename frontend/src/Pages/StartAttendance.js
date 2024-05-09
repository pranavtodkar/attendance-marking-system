import React, { useState, useEffect } from 'react'
import Button from './Button'
import { toast } from 'react-toastify';

const StartAttendance = () => {  

  const [courses, setCourses] = useState([]);   
  const [courseCode, setCourseCode] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionExists, setSessionExists] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const getStartTime = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getStartTime`, {
          method: 'POST',
          headers: {
            'Authorization': localStorage.getItem('JWT'),
            'Content-Type' : 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          setSessionExists(data.sessionExists);

          if(!data.sessionExists){
            return;
          }

          setStartTime(new Date(data.startTime));
          setCourseCode(data.courseCode);            
        } else {
          console.error('Error fetching start time:', response.status);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getStartTime();
  }, [refresh]);

  useEffect(() => {
    let interval;

    if (startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsedMilliseconds = now.getTime() - startTime.getTime();
        setElapsedTime(elapsedMilliseconds);
      }, 1000);
    }

    return () => clearInterval(interval);

  }, [startTime]);

  useEffect(() => {
    const getMyCourses = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getMyCourses`,{
        method: 'POST',
        headers:{
          'Content-Type' : 'application/json',
          'Authorization': localStorage.getItem('JWT'),
        }
      });
      const courses = await res.json();
      console.log("listCourses:", courses);

      setCourses(courses);
    }
    getMyCourses();      
  }, [refresh]);       

  
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
          'Authorization': localStorage.getItem('JWT'),
        },
        body: JSON.stringify({ course_code : courseCode })
      }).then((res) => {
        toast.success("Attendance Started");
        console.log("Attendance Started");

        // Refresh Page
        setRefresh(!refresh);
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
          'Authorization': localStorage.getItem('JWT'),
        },
        body: JSON.stringify({ course_code : courseCode })
      }).then((res) => {
        toast.success("Attendance Ended");

        // Refresh Page
        setRefresh(!refresh);
        setStartTime(null);
        setElapsedTime(0);
      }).catch((err) => { 
        console.log(err);
      });
  }

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
      <>
          <div className='flex gap-4 mt-10 mx-auto items-center'>
              <p className={`mx-auto text-8xl mt-20 ${!sessionExists ? 'text-gray-300' : 'text-gray-500'}`}>{formatTime(elapsedTime)}</p>
          </div>
          <div className="flex flex-col items-center mt-20">
              <div>                    
                  <select className='border-2 border-[#0049d9] w-80 h-11 my-2 rounded-lg pl-2' disabled={sessionExists} id="course" value={courseCode} onChange={handleSelectChange}>
                      <option value="">Select a course</option>
                      {courses && courses.map((it, index) => (
                          <option key={index} value={it.course_code}>
                              {it.course_code}
                          </option>
                      ))}
                  </select>
              </div>
              { !sessionExists ?
                (<button  onClick={beginAttendance} className='w-80 h-11 my-2 rounded-lg text-white bg-[#046D28]'>Start Attendance</button>) :
                (<button onClick={stopAttendance} className='w-80 h-11 my-2 rounded-lg text-white bg-[#FF0000]'>Stop Attendance</button>)
              }
              <Button value='Home' css='bg-white text-[#0049d9] border-2' dst='faculty' ></Button>
          </div>

      </>
  )
}

export default StartAttendance


