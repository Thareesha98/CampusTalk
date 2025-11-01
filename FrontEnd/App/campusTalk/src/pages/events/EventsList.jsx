import React, { useEffect, useState } from 'react'
import { fetchEvents } from '../../services/eventService.js'
import { Link } from 'react-router-dom'
export default function EventsList(){
  const [events,setEvents]=useState([])
  useEffect(()=>{ fetchEvents().then(setEvents).catch(()=>{}) },[])
  return (
    <section className="page">
      <div className="page-head"><h2>Events</h2></div>
      <div className="grid">
        {events.map(e=> (
          <article key={e.id} className="card">
            <div className="card-body">
              <h3><Link to={`/events/${e.id}`}>{e.title}</Link></h3>
              <p className="muted">{new Date(e.date).toLocaleString()}</p>
              <p className="card-desc">{e.description?.slice(0,140)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
