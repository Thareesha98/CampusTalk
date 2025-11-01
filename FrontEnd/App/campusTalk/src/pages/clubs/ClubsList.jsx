import React, { useEffect, useState } from 'react'
import { fetchClubs } from '../../services/clubService.js'
import { Link } from 'react-router-dom'
export default function ClubsList(){
  const [clubs,setClubs]=useState([])
  useEffect(()=>{ fetchClubs().then(setClubs).catch(()=>{}) },[])
  return (
    <section className="page">
      <div className="page-head"><h2>Clubs</h2></div>
      <div className="grid">
        {clubs.map(c=> (
          <article key={c.id} className="card">
            <div className="card-body">
              <h3><Link to={`/clubs/${c.id}`}>{c.name}</Link></h3>
              <p className="muted">{c.universityName}</p>
              <p className="card-desc">{c.description?.slice(0,140)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
