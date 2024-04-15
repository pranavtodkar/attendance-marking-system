import { React , useEffect, useState } from 'react';
import image from './logo.jpg'
import Button from './Button.js'

function StudentHome() 
{
  const [rollNo, setRollNo] = useState();

  const onMark = async () => {
    console.log(rollNo)
    await fetch("http://localhost:8080/getFaceData",{
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({rollNo})
    });

    // const response = await fetch('/api/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ name, email, age })
    // });

    setRollNo("")
  }

  useEffect(()=>{
    const fetchData = async () => {
      const response = await fetch('/getFaceData')
      const data = await response.json();
      console.log(data)
    }
    fetchData();
  }, []);

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
