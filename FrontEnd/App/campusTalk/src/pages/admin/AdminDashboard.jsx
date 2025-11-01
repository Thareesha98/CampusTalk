import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'

function Overview(){
  return (
    <div>
      <h3>Admin Overview</h3>
      <p>Manage core content: universities, clubs, events, users.</p>
      <ul>
        <li><Link to="universities">Universities</Link></li>
        <li><Link to="clubs">Clubs</Link></li>
        <li><Link to="events">Events</Link></li>
      </ul>
    </div>
  )
}

export default function AdminDashboard(){
  return (
    <section className="page admin">
      <h2>Admin</h2>
      <Routes>
        <Route index element={<Overview/>} />
        <Route path="*" element={<Overview/>} />
      </Routes>
    </section>
  )
}
