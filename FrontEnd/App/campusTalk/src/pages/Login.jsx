import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Login(){
const [creds, setCreds] = useState({ username:'', password:'' });
const [loading, setLoading] = useState(false);
const navigate = useNavigate();


function onChange(e){ setCreds(prev=>({...prev,[e.target.name]: e.target.value})); }


async function onSubmit(e){
e.preventDefault();
setLoading(true);
try{
const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(creds) });
if(res.ok){
const { token } = await res.json();
localStorage.setItem('token', token);
navigate('/admin');
} else {
alert('Login failed');
}
} catch(err){ console.error(err); alert('Network error'); }
finally{ setLoading(false); }
}


return (
<section className="page form-page narrow">
<h2>Admin Login</h2>
<form className="form" onSubmit={onSubmit}>
<label>Username<input name="username" value={creds.username} onChange={onChange} required /></label>
<label>Password<input type="password" name="password" value={creds.password} onChange={onChange} required /></label>
<div className="form-actions">
<button className="btn primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
</div>
</form>
</section>
);
}