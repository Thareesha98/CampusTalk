import React, { useEffect, useState } from 'react';
import TalkCard from '../shared/TalkCard';


export default function TalksList(){
const [talks, setTalks] = useState([]);
const [loading, setLoading] = useState(true);
const [query, setQuery] = useState('');


useEffect(() => {
// Replace /api/talks with your backend URL
fetch('/api/talks')
.then(r => r.json())
.then(data => setTalks(data || []))
.catch(err => {
console.error('Error fetching talks', err);
setTalks([]);
})
.finally(() => setLoading(false));
}, []);


const filtered = talks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));


return (
<section className="page">
<div className="page-head">
<h2>Campus Talks</h2>
<input className="search" placeholder="Search talks..." value={query} onChange={e=>setQuery(e.target.value)} />
</div>


{loading ? <p>Loading...</p> : (
<div className="grid">
{filtered.length === 0 && <p>No talks found — try creating one.</p>}
{filtered.map(t => <TalkCard key={t.id} talk={t} />)}
</div>
)}
</section>
);
}

