import React from 'react';
import { Link } from 'react-router-dom';


export default function Home(){
return (
<section className="hero">
<div className="hero-inner">
<h1>Welcome to CampusTalk</h1>
<p>Find and share campus talks, study groups, events and more — beautifully.</p>
<div className="hero-cta">
<Link to="/talks" className="btn primary">Browse Talks</Link>
<Link to="/create" className="btn ghost">Create a Talk</Link>
</div>
</div>
<div className="hero-graphic" aria-hidden>
{/* decorative graphic — you can replace with an SVG or image */}
</div>
</section>
);
}