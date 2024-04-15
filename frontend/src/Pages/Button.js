import React from 'react'
import { Link } from 'react-router-dom';

const Button = (props) => {
  return (
    <div>
      <Link to={`/${props.dst}`}><button onClick={props.redirect} className={`${props.css} w-80 h-11 my-2 rounded-lg`} > {props.value}</button></Link>
    </div>
  )
}
 
export default Button



