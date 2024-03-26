import { React , useState } from 'react';
import image from './logo.jpg'
import Button from './Button.js'

function AdminHome() 
{
  const details = [{
    id: "hard",
    pswd: "1234"
  }]

  const [user, setUser] = useState({});
  const [verify, setVerify] = useState(false);

  const onMark = () => {
    if(user.id === details[0].id && user.pswd === details[0].pswd)
    {
      setVerify(true)
    }
    else{
      setVerify(false)
      alert("Incorrect Password")
    }
    console.log(user)
    console.log(verify)
  }

  const handleChange = (e) => {
    setUser({
      ...user,
      id: e.target.value
    })
  }
  const handleChangePassword = (e) => {
    setUser({
      ...user,
      pswd: e.target.value
    })
  }
  
  return (
    <>
      <div className="logo m-100 flex justify-center mt-40 ">
        <img width = "175px" height = "183px" src = {image} alt="" />
      </div>
      <div className="mt-8">
        <form className='flex flex-col gap-0 items-center mb-5'>
          <input value = {user.id} onChange={handleChange} className='border-2 border-[#0049d9] w-80 h-11 my-2 rounded-lg pl-2' type='text' placeholder='Username:  '></input>
          <input value = {user.pswd} onChange={handleChangePassword} className='border-2 border-[#0049d9] w-80 h-11 my-2 rounded-lg pl-2' type='password' placeholder='Password: '></input>
        </form>
        <Button css = 'text-white bg-[#0049d9]' value='LOGIN' redirect = {onMark} dst = {verify ? "admin/startattendance": "admin"} ></Button>
      </div>
    </>
  );
}

export default AdminHome;
