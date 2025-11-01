import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function CreateTalk(){
const [form, setForm] = useState({ title:'', speaker:'', date:'', description:'', content:'', contact:'' });
const [saving, setSaving] = useState(false);
const navigate = useNavigate();


function handleChange(e){
setForm(prev => ({...prev, [e.target.name]: e.target.value}));
}


async function handleSubmit(e){
e.preventDefault();
setSaving(true);
try{
const res = await fetch('/api/talks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
if(res.ok){
const created = await res.json();
navigate(`/talks/${created.id}`);
} else {
alert('Failed to create talk');
}
} catch(err){
console.error(err);
alert('Network error');
} finally{ setSaving(false); }
}


return (
<section className="page form-page">
<h2>Create a Talk</h2>
<form className="form" onSubmit={handleSubmit}>
<label>Title<input name="title" value={form.title} onChange={handleChange} required /></label>
<label>Speaker<input name="speaker" value={form.speaker} onChange={handleChange} /></label>
<label>Date & Time<input type="datetime-local" name="date" value={form.date} onChange={handleChange} required /></label>
<label>Short description<textarea name="description" value={form.description} onChange={handleChange} rows="3" /></label>
<label>Full content<textarea name="content" value={form.content} onChange={handleChange} rows="8" /></label>
<label>Contact (email)<input name="contact" value={form.contact} onChange={handleChange} type="email" /></label>
<div className="form-actions">
<button type="submit" className="btn primary" disabled={saving}>{saving ? 'Saving...' : 'Publish'}</button>
<button type="reset" className="btn ghost">Reset</button>
</div>
</form>
</section>
);
}