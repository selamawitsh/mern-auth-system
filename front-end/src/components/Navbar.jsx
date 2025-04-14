import React from 'react'
import {assets} from '../assets/assets.js'
import './Navbar.css';
import {useNavigate} from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate()
  return (
    <div className="navbar-container">
        <img src={assets.logo} alt="logo image" className="logo-img" />

        <button onClick={()=>navigate('/login')} className="custom-button">Log in <img src={assets.arrow_icon} alt="" /></button>
    </div>

  )
}

export default Navbar