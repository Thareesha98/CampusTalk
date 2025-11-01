import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../services/authService.js'

export default function Register(){
  const [form,setForm]=useState({username:'',email:'',password:''});
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate()
  async function submit(e){
    e.preventDefault(); setLoading(true)
    try{ await register(form); navigate('/login') }catch(err){ alert('Register failed') }
    finally{ setLoading(false) }
  }
  return (
    <section className="page form-page narrow">
      <h2>Create account</h2>
      <form className="form" onSubmit={submit}>
        <label>Username<input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/></label>
        <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label>
        <label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></label>
        <div className="form-actions"><button className="btn primary" disabled={loading}>{loading?'Creating...':'Create account'}</button></div>
      </form>
    </section>
  )
}
