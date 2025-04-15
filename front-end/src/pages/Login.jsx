import React, { useContext, useState } from 'react'
import { assets } from './../assets/assets';
// import '../styles/Login.css';
import {useNavigate} from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const Login = () => {
  const navigate = useNavigate()

  const {backendUrl, setIsLoggedin}= useContext(AppContent);

  const [state, setState] = useState('Sign Up')
  const [name,setName]= useState("");
  const [email,setEmail]= useState("");
  const [password,setPassword]= useState("");

  // const OnsubmitHandler = async (e) => {
  //   try {
  //     e.preventDefault();
  //     axios.defaults.withCredentials=true;
  //     if(state === 'Sign Up'){
  //       const {data} =await axios.post(backendUrl + '/api/auth/register' ,
  //         {name, email, password}
  //        )

  //        if(data.success){
  //         setIsLoggedin(true)
  //         navigate('/')
  //        }else{
  //         toast.error(data.message)
  //        }
  //     }else{
  //       const {data} =await axios.post(backendUrl + '/api/auth/login' ,
  //         {email, password}
  //        )

  //        if(data.success){
  //         setIsLoggedin(true)
  //         navigate('/')
  //        }else{
  //         toast.error(data.message)
  //        }


  //     }
  //   } catch (error) {
  //     toast.error(data.message)
  //   }
    
  // }
  const OnsubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
  
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', {
          name,
          email,
          password,
        });
  
        console.log('Register Response:', data); // Log the response for debugging
  
        if (data.success) {
          setIsLoggedin(true);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', {
          email,
          password,
        });
  
        console.log('Login Response:', data); // Log the response for debugging
  
        if (data.success) {
          setIsLoggedin(true);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);  // Log the error for debugging
      toast.error("An error occurred during login or registration");
    }
  };
  

  return (
    <div className="login-container">
    <img onClick={()=>navigate('/')} src={assets.logo} alt="" className="logo-img" />
    <div className="form-container">
      <h2 className="form-title">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
      <p className="form-subtitle">{state === 'Sign Up' ? 'Create your account' : 'Log in to your account'}</p>
      <form onSubmit={OnsubmitHandler}>
        {state==='Sign Up' && (
          <div className="input-container">
          <img src={assets.person_icon} alt="" className="icon" />
          <input 
          onChange={e=>setName(e.target.value)} 
          value = {name}
          className="input-field" type="text" placeholder="Full Name" required />
        </div>
        )}
        
        <div className="input-container">
          <img src={assets.mail_icon} alt="" className="icon" />
          <input
          onChange={e=>setEmail(e.target.value)} 
          value = {email}
          className="input-field" type="email" placeholder="Email" required />
        </div>

        <div className="input-container">
          <img src={assets.lock_icon} alt="" className="icon" />
          <input
          onChange={e=>setPassword(e.target.value)} 
          value = {password}
          className="input-field" type="password" placeholder="password" required />
        </div>

        <p onClick={()=>navigate('/reset-password')} className="forgot-password">Forgot Password?</p>

      <button className="submit-button">{state}</button>
      </form>

      {state === 'Sign Up' ?
      (
        <p className="footer-text">
          Already have an account?{' '}
          <span className="footer-link" onClick={() => setState('Login')}>
            Login here
          </span>
        </p>
      ):
      
      (<p className="footer-text">
        Don't have an account?{' '} 
        <span className="footer-link" onClick={()=>setState('Sign Up')}>
          Sign Up
          </span>
          </p>) }
    </div>
  </div>
  )
}

export default Login