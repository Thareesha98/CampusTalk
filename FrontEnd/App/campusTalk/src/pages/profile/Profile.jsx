import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Profile(){
  const { id } = useParams()
  const [user,setUser]=useState(null)
  useEffect(()=>{
    fetch(`/api/users/${id}`).then(r=>r.json()).then(setUser).catch(()=>{})
  },[id])
  if(!user) return <p>User not found</p>
  return (
    <section className="page">
      <div className="profile-card">
        <div className="avatar">{user.name?.[0]}</div>
        <div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <p>{user.bio}</p>
        </div>
      </div>
    </section>
  )
}
