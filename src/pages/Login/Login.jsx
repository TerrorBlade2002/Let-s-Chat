import React, { useState } from 'react'
import './Login.css'  /* This helps to link the Login.css file with this .jsx file */
import assets from '../../assets/assets'  
import { signup, login, resetPass } from '../../config/firebase'

/* ../../ helps to go up by 2 folders from the current directory, i.e. to src! From there, go to assets folder and access assets.js! */
/* Use input*3.form-input as snippet for the 3 input fields (form-input = className) */
/* To add a <div> container with className cn, write div.cn*/
const Login = () => {

  /*create a state variable using const. Use this in <h2> instead of "Sign Up" text*/ 
  const [currState, setCurrState] = useState("Sign Up");  /* setCurrState is the setter function here */
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (event) => {

    event.preventDefault(); // To prevent from reloading webpage when we submit form
    if (currState === "Sign Up"){

      signup(userName, email, password)

    }
    else{

      login(email, password)

    }

  }

  return (
    <div className='login'>
      
      <img src={assets.lets_chat_logo} alt="" className="logo" />  
      <form onSubmit={onSubmitHandler} className="login-form">

        <h2>{currState}</h2>
        {currState === "Sign Up"? <input onChange={(e)=>setUserName(e.target.value)} value={userName} type="text" placeholder='Username' className="form-input" required/>: null}
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' className="form-input" required />
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' className="form-input" required/>

        <button type='submit'>{currState === "Sign Up" ? "Create New Account" : "Login Now"}</button>

        <div className="login-term">

          <input type= "checkbox" required/>
          <p>I agree to the terms of use & privacy policy</p>

        </div>

        <div className="login-forgot">

          {

            currState === "Sign Up"
            ? <p className="login-toggle">Already have an account? <span onClick={()=>setCurrState("Login")}>Click to login here</span></p>
            : <p className="login-toggle">Want to create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>

          }

          {currState === "Login" ? <p className="login-toggle">Forgot Password? <span onClick={()=>resetPass(email)}>Click here to reset password</span></p> : null}

        </div>

      </form>
          
    
    </div>
  )

/* onClick helps to change the Sign Up text to "Login" */ 
}

export default Login