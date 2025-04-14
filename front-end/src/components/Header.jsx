import React from 'react'
import './Header.css'
import { assets } from './../assets/assets';
const Header = () => {
  return (
    <div className="main-container">
        <img src={assets.header_img} alt=""  className="profile-img"/>
        <h1 className="heading-with-icon">Hey Developer <img className="wave-icon" src={assets.hand_wave} alt="" /></h1>

        <h2 className="section-title">Welcome to Selam's first Project</h2>
        <p className="section-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis sunt officiis reiciendis. Iste repellendus nesciunt id, dicta aut quasi assumenda minus illum, aliquid ut consequuntur maiores amet ab dolorum fugiat.</p>
        <button className="get-started-btn">Get Started</button>
    </div>
  )
}

export default Header