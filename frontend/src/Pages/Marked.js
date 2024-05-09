import React from 'react'
import image from '../images/check.png' 
import Button from './Button'
import { useLocation } from 'react-router-dom';


const Marked = () => {

    const location = useLocation();
    const attendanceData = location.state && location.state.attendanceData;
    console.log("attendanceData:", attendanceData);
    
    const details = {
        name: attendanceData.data.name,
        rollno: attendanceData.data.roll_no,
        courseCode: attendanceData.data.course_code,
        markedAt: attendanceData.data.marked_at
    }
  return (
    <>
        <div className='flex gap-4 mt-10 mx-auto w-[45vh] items-center'>
        <div className='bg-[#d9d9d9] w-24 h-32'></div>
        <ul className='text-left items-center'>
            <li><b className='text-[#002772]'>Name:</b> {details.name}</li>
            <li><b className='text-[#002772]'>Roll No.:</b> {details.rollno} </li>
            {/* <li><b className='text-[#002772]'>Branch :</b> {details.branch}</li> */}
            <li><b className='text-[#002772]'>Course Code:</b> {details.courseCode}</li>
            <li><b className='text-[#002772]'>Date:</b> {new Date(details.markedAt).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'})}</li>
        </ul>
        </div>
        <img className='mx-auto mt-20' alt  = "success tick image" width = "175px" height = "183px" src = {image}  />
        <h1 className='my-10 text-2xl font-bold text-[#002772]'>Attendance Marked</h1>
        <Button value='Home'css='text-white bg-[#0049d9]' dst=''></Button>
    </>
  )
}

export default Marked;
