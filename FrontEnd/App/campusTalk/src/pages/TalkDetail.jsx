import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function TalkDetail(){
const { id } = useParams();
const [talk, setTalk] = useState(null);
const [loading, setLoading] = useState(true);


useEffect(()=>{
fetch(`/api/talks/${id}`)
.then(r=> r.json())
.then(setTalk)
.catch(err=> console.error(err))
.finally(()=> setLoading(false));
}, [id]);


if(loading) return <p>Loading...</p>;
if(!talk) return <p>Talk not found</p>;


return (
<article className="page detail">
<div className="detail-header">
<h2>{talk.title}</h2>
<p className="muted">{talk.speaker} • {new Date(talk.date).toLocaleString()}</p>
</div>
<div className="detail-body">
<img src={talk.image || '/placeholder.jpg'} alt="talk" className="detail-image" />
<div className="detail-content">
<p>{talk.content}</p>
</div>
</div>
</article>
);
}