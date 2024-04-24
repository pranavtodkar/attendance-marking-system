import { React , useState } from 'react';
import image from './logo.jpg'
import Button from './Button.js'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function AdminHome() {

  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [verify, setVerify] = useState(false);

  const onLogin = async () => {
    if(user.id === undefined || user.id === "" 
    // || user.pswd === undefined || user.pswd === ""
    ){
      toast.error("Please enter all the fields");
      return;
    }

    // Login Logic

    navigate('/admin/startAttendance', { state: { teacher_id: user.id } });
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
        <div>
          <div><button onClick={onLogin} className={`text-white bg-[#0049d9] w-80 h-11 my-2 rounded-lg`} > LOGIN</button></div>
        </div>  
      </div>
    </>
  );
}

export default AdminHome;
