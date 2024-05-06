import { React, useState, useEffect } from 'react';
import image from '../images/logo.jpg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

function FacultyHome() {

  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      if(codeResponse){
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
              headers: {
                  Authorization: `Bearer ${codeResponse.access_token}`,
                  Accept: 'application/json'
              }
          })
          .then( async(res) => {
              // console.log('data', res.data);
              const googleUser = res.data;

              if(googleUser.email.split('@')[1] !== 'iitgoa.ac.in'){
                toast.error('Please use IIT Goa email');
                return;
              }

              const teacherLogin = async () => {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/teacherLogin`,{
                  method: 'POST',
                  headers:{
                    'Content-Type' : 'application/json',
                  },
                  body: JSON.stringify({ email : googleUser.email })
                });
                const { JWT } = await res?.json();
        
                localStorage.setItem('JWT', JWT);
                toast.success(`Login Successful`);
              }
              await teacherLogin();   

              navigate('/faculty/startAttendance');

          })
          .catch((err) => {
            
            console.log(err);
            toast.error('Login Failed');
          });
      }
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <>
        <div className="logo m-100 flex justify-center mt-40 ">
          <img width="175px" height="183px" src={image} alt="" />
        </div>
        <div className="mt-8">
          <button onClick={login} className={`text-white bg-[#0049d9] w-80 h-11 my-2 rounded-lg`} > Sign in with Google</button>
        </div>
    </>
  );
}

export default FacultyHome;
