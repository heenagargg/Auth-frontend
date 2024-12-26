import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

export const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate=useNavigate()

  const handleChange = (e) => {
    const {name,value}=e.target
    const copyLoginInfo={...loginInfo}
    copyLoginInfo[name]=value
    setLoginInfo(copyLoginInfo)
  };

  const handleLogin=async (e)=>{
    e.preventDefault()
    const {email,password}=loginInfo
    if(!email || !password){
      return handleError("All credentials required")
    }
    try {
      const url = "http://localhost:5000/auth/login"
      const response=await fetch(url,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(loginInfo)
      })
      const result=await response.json()
      const {message,success,jwtToken,name,error}=result
      if(success){
        handleSuccess(message)
        localStorage.setItem('token',jwtToken)
        localStorage.setItem('loggedInUser',name)
        setTimeout(()=>{
          navigate("/home")
        },1000)
      }else if(error){
        console.log(error)
        const details=error?.details[0].message
        handleError(details)
      }else if(!success){
        handleError(message)
      }
    } catch (err) {
      handleError(err)
    }
  }
  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input 
          onChange={handleChange} 
          type="text" 
          name="email" 
          placeholder="Enter your email " 
          value={loginInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="text"
            name="password"
            placeholder="Enter your password "
            value={loginInfo.password}
          />
        </div>
        <button>Login</button>
        <span>
          Don't have an account?
          <Link to="/signup">Signup</Link>{" "}
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};
