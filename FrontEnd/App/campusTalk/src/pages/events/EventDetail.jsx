import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchEvent, rsvpEvent } from '../../services/eventService.js'
export default function EventDetail(){
  const { id } = useParams()
  const [event,setEvent]=useState(null)
  useEffect(()=>{ fetchEvent(id).then(setEvent).catch(()=>{}) },[id])
  if(!event) return <p>Event not found</p>
  async function onRsvp(){ try{ await rsvpEvent(id); alert('RSVP successful') }catch(err){ alert('Failed') } }
  return (
    <section className="page detail">
      <h2>{event.title}</h2>
      <p className="muted">{new Date(event.date).toLocaleString()}</p>
      <div className="detail-body">
        <div className="detail-content">
          <p>{event.description}</p>
          <div className="form-actions"><button className="btn primary" onClick={onRsvp}>RSVP</button></div>
          <h3>Attendees</h3>
          <ul className="compact-list">{event.attendees?.map(a=> <li key={a.id}>{a.name}</li>)}</ul>
        </div>
      </div>
    </section>
  )
}
