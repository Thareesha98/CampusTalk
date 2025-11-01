import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchClub, joinClub } from '../../services/clubService.js'
export default function ClubDetail(){
  const { id } = useParams()
  const [club,setClub]=useState(null)
  useEffect(()=>{ fetchClub(id).then(setClub).catch(()=>{}) },[id])
  if(!club) return <p>Club not found</p>
  async function onJoin(){ try{ await joinClub(id); alert('Joined') }catch(err){ alert('Failed') } }
  return (
    <section className="page detail">
      <h2>{club.name}</h2>
      <p className="muted">{club.universityName}</p>
      <div className="detail-body">
        <div className="detail-content">
          <p>{club.description}</p>
          <div className="form-actions"><button className="btn primary" onClick={onJoin}>Join Club</button></div>
          <h3>Members</h3>
          <ul className="compact-list">{club.members?.map(m=> <li key={m.id}>{m.name} • {m.role}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
