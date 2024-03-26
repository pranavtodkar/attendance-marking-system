import React from 'react'
import Button from './Button'

const StartAttendance = () => {
    const details = {
        name: 'Hard Kapadia',
        userName: 2206316,
        school: 'School of Computer Science'
    }
  return (
    <>
        <div className='flex gap-4 mt-10 mx-auto w-[45vh] items-center'>
        <div className='bg-[#d9d9d9] w-24 h-32'></div>
        <ul className='text-left items-center'>
            <li><b className='text-[#002772]'>Name:</b> {details.name}</li>
            <li><b className='text-[#002772]'>UserName:</b> {details.userName} </li>
            <li><b className='text-[#002772]'>School :</b> {details.school}</li>
            <li><b className='text-[#002772]'>Date:</b> XX/XX/2024</li>
        </ul>
        </div>
        <div className="flex flex-col items-center mt-40">
            <input className='border-2 border-[#0049d9] w-80 h-11 my-2 rounded-lg pl-2' type='text' placeholder='Course Code'></input>
            <button className='w-80 h-11 my-2 rounded-lg text-white bg-[#046D28]'>Start Attendance</button>
            <button className='w-80 h-11 my-2 rounded-lg text-white bg-[#FF0000]'>Stop Attendance</button>
            <Button value='Home'css='text-white bg-[#0049d9]' dst=''></Button>
        </div>

    </>
  )
}

export default StartAttendance
