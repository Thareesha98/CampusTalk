import React, { useEffect, useState } from 'react'
import { fetchEvents } from '../services/eventService.js'
import { fetchClubs } from '../services/clubService.js'

export default function Home(){
  const [events,setEvents]=useState([])
  const [clubs,setClubs]=useState([])
  useEffect(()=>{ fetchEvents().then(setEvents).catch(()=>{}); fetchClubs().then(setClubs).catch(()=>{}) },[])
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1>CampusTalk</h1>
        <p>Connect with clubs, join events & discuss topics across your campus.</p>
        <div className="hero-cta">
          <a href="/posts" className="btn primary">Browse Posts</a>
          <a href="/events" className="btn ghost">Upcoming Events</a>
        </div>
      </div>
      <aside className="panel">
        <h3>Upcoming Events</h3>
        <ul className="compact-list">
          {events.slice(0,5).map(e=> <li key={e.id}>{e.title} • {new Date(e.date).toLocaleDateString()}</li>)}
        </ul>
        <h3>Popular Clubs</h3>
        <ul className="compact-list">
          {clubs.slice(0,5).map(c=> <li key={c.id}>{c.name}</li>)}
        </ul>
      </aside>
    </section>
  )
}
