import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getToken, logout } from '../services/authService.js'

export default function Navbar(){
  const token = getToken()
  return (
    <header className="site-header">
      <div className="brand"><Link to="/" className="logo">Campus<span>Talk</span></Link></div>
      <nav className="nav">
        <NavLink to="/posts" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Posts</NavLink>
        <NavLink to="/clubs" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Clubs</NavLink>
        <NavLink to="/events" className={({isActive})=> isActive? 'nav-link active':'nav-link'}>Events</NavLink>
      </nav>
      <div className="nav-actions">
        {!token ? (
          <>
            <Link to="/login" className="btn small ghost">Login</Link>
            <Link to="/register" className="btn small">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile/me" className="btn small ghost">Profile</Link>
            <button className="btn small" onClick={()=>{logout(); window.location='/'}}>Logout</button>
          </>
        )}
      </div>
    </header>
  )
}
