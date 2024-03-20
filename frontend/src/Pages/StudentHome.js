import { React , useState } from 'react';
import image from './logo.jpg'
import Button from './Button.js'

function StudentHome() 
{
  const [rollNo, setRollNo] = useState();

  const onMark = () => {
    console.log(rollNo)
    // setRollNo("")
  }
  const handleChange = (e) =>{
    setRollNo(e.target.value)
    // console.log(rollNo)
    
  }
  return (
    <div className="SignInPage">
      <div className='h-12 flex bg-[#002772] text-white justify-center items-center'>Attendance Marking System</div>
      <div className="logo m-100 flex justify-center mt-40 ">
        <img width = "175px" height = "183px" src = {image} alt="" />
      </div>
      <div className="mt-8">
        <form>
          <input value = {rollNo} onChange={handleChange} className='border-2 border-[#0049d9] w-52 h-11 my-2 rounded-lg pl-2' type='text' placeholder='Enter Roll No. '></input>
        </form>
        <Button value = "Mark Attendance" redirect = {onMark} />
        
      </div>
    </div>
  );
}

export default StudentHome;
