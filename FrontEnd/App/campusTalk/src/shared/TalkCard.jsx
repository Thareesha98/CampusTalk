import React from 'react';
import { Link } from 'react-router-dom';


export default function TalkCard({ talk }){
const when = new Date(talk.date).toLocaleString();
return (
<article className="card">
<div className="card-media" style={{backgroundImage:`url(${talk.image||'/placeholder.jpg'})`}} />
<div className="card-body">
<h3 className="card-title"><Link to={`/talks/${talk.id}`}>{talk.title}</Link></h3>
<p className="muted">By {talk.speaker || 'Unknown'} • {when}</p>
<p className="card-desc">{talk.description?.slice(0,140) || ''}...</p>
<div className="card-actions">
<Link to={`/talks/${talk.id}`} className="btn small">View</Link>
<a href={`mailto:${talk.contact}`} className="btn small ghost">Contact</a>
</div>
</div>
</article>
);
}