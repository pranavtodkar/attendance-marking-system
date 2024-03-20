import React from 'react'

const Button = (props) => {
  return (
    <div>
      <button onClick={props.redirect}  className='bg-[#0049d9] w-52 h-11 my-2 rounded-lg text-white'>{props.value}</button>
    </div>
  )
}

export default Button



