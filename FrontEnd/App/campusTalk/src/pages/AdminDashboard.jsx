import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';


function Overview(){
return (
<div>
<h3>Admin Overview</h3>
<p>Manage talks, messages and site settings here.</p>
<ul>
<li><Link to="messages">Messages</Link></li>
<li><Link to="talks">Manage Talks</Link></li>
</ul>
</div>
);
}


export default function AdminDashboard(){
// Authentication guard could be added here
return (
<section className="page admin">
<h2>Admin Dashboard</h2>
<Routes>
<Route index element={<Overview/>} />
<Route path="messages" element={<div><h3>Messages</h3><p>Coming soon</p></div>} />
<Route path="talks" element={<div><h3>Manage Talks</h3><p>Coming soon</p></div>} />
</Routes>
</section>
);
}