import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../../services/postService.js'

export default function CreatePost(){
  const [form,setForm]=useState({title:'',content:''})
  const [saving,setSaving]=useState(false)
  const nav = useNavigate()
  async function submit(e){ e.preventDefault(); setSaving(true); try{ const created = await createPost(form); nav(`/posts/${created.id}`) }catch(err){ alert('Failed') }finally{ setSaving(false) } }
  return (
    <section className="page form-page">
      <h2>New Post</h2>
      <form className="form" onSubmit={submit}>
        <label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></label>
        <label>Content<textarea rows="8" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required/></label>
        <div className="form-actions"><button className="btn primary" disabled={saving}>{saving?'Saving...':'Publish'}</button></div>
      </form>
    </section>
  )
}
