import React from 'react'
import Button from './Button';
import { Link } from 'react-router-dom';

const detectFail = () => {
  const toHome = () => {
    console.log('to home')
  }
  return (
    <>
      <div className='h-fit blur'>
        <div className='mt-10 mb-5 w-[40vh] m-auto'>
          <Link to='/marked'><div className='h-[70vh] bg-[#d9d9d9]'></div></Link>
          <h4 className=' text-left'>Please wait...</h4>
        </div>
        <a href='/verify'><button className='text-white bg-[#0049d9] w-80 h-11 my-2 rounded-lg'>Retry</button></a>
        <Button css='bg-white text-[#0049d9] border-2' value='Home' redirect={toHome} dst=''></Button>
      </div>
      <div className='flex justify-center items-center'>
        <div className='h-12 w-11 bg-[#ffffff] fixed mx-auto my-auto'>
          Hello
        </div>
      </div>
    </>
  )
}

export default detectFail