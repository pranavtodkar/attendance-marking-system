import { React , useState } from 'react';
import image from './logo.jpg'
import Button from './Button.js'

function StudentHome() 
{
  const [rollNo, setRollNo] = useState();

  const onMark = async () => {
    console.log(rollNo)
    const a = await fetch("http://localhost:8080",{
      method: 'POST',
      // headers:{
      //   'Content-Type' : 'application/json',
      // },
      // body:{ rollno: rollNo}
      rollNo
    })

    setRollNo("")
  }
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
        <Button css = 'text-white bg-[#0049d9]' value='Mark Attendance' redirect = {onMark} dst = "verify" ></Button>
      </div>
    </>
  );
}

export default StudentHome;
