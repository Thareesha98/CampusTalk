import React, { useEffect, useState } from 'react'
import { fetchPosts } from '../../services/postService.js'
import { Link } from 'react-router-dom'
export default function PostsList(){
  const [posts,setPosts]=useState([])
  useEffect(()=>{ fetchPosts().then(setPosts).catch(()=>{}) },[])
  return (
    <section className="page">
      <div className="page-head">
        <h2>Posts</h2>
        <div>
          <Link to="/posts/new" className="btn small">New Post</Link>
        </div>
      </div>
      <div className="grid">
        {posts.map(p=> (
          <article key={p.id} className="card">
            <div className="card-body">
              <h3><Link to={`/posts/${p.id}`}>{p.title}</Link></h3>
              <p className="muted">By {p.authorName || 'Unknown'}</p>
              <p className="card-desc">{p.content?.slice(0,180)}...</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
