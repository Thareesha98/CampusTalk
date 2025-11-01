import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setToken } from '../../services/authService.js'

export default function Login(){
  const [form,setForm]=useState({username:'',password:''})
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate()
  async function submit(e){
    e.preventDefault(); setLoading(true)
    try{
      const data = await login(form)
      if(data.token){ setToken(data.token); navigate('/'); }
    }catch(err){ alert('Login failed') }
    finally{ setLoading(false) }
  }
  return (
    <section className="page form-page narrow">
      <h2>Sign in</h2>
      <form className="form" onSubmit={submit}>
        <label>Username<input name="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></label>
        <div className="form-actions">
          <button className="btn primary" disabled={loading}>{loading?'Signing...':'Sign in'}</button>
        </div>
      </form>
    </section>
  )
}
