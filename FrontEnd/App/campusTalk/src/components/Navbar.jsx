import React from 'react';
import { Link, NavLink } from 'react-router-dom';


export default function Navbar(){
return (
<header className="site-header">
<div className="brand">
<Link to="/" className="logo">Campus<span>Talk</span></Link>
</div>
<nav className="nav">
<NavLink to="/talks" className="nav-link">Talks</NavLink>
<NavLink to="/create" className="nav-link">Create</NavLink>
<NavLink to="/login" className="nav-link">Login</NavLink>
</nav>
<div className="hamburger" aria-hidden>☰</div>
</header>
);
}