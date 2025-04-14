import React, { useState } from 'react'
import { assets } from './../assets/assets';
// import '../styles/Login.css';
import {useNavigate} from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate()

  const [state, setState] = useState('Sign Up')
  const [name,setName]= useState("");
  const [email,setEmail]= useState("");
  const [password,setPassword]= useState("");

  return (
    <div className="login-container">
    <img onClick={()=>navigate('/')} src={assets.logo} alt="" className="logo-img" />
    <div className="form-container">
      <h2 className="form-title">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
      <p className="form-subtitle">{state === 'Sign Up' ? 'Create your account' : 'Log in to your account'}</p>
      <form>
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