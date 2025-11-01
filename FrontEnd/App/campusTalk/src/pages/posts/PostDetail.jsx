import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPost, commentPost } from '../../services/postService.js'

export default function PostDetail(){
  const { id } = useParams()
  const [post,setPost]=useState(null)
  const [loading,setLoading]=useState(true)
  const [comment,setComment]=useState('')
  useEffect(()=>{ fetchPost(id).then(d=>{setPost(d)}).catch(()=>{}).finally(()=>setLoading(false)) },[id])
  async function submitComment(e){ e.preventDefault(); try{ await commentPost(id,{text:comment}); setComment(''); const updated = await fetchPost(id); setPost(updated) }catch(err){ alert('Comment failed') } }
  if(loading) return <p>Loading...</p>
  if(!post) return <p>Post not found</p>
  return (
    <article className="page detail">
      <h2>{post.title}</h2>
      <p className="muted">By {post.authorName}</p>
      <div className="detail-body">
        <div className="detail-content">
          <p>{post.content}</p>
          <section className="comments">
            <h3>Comments</h3>
            {post.comments?.length ? post.comments.map(c=> (
              <div key={c.id} className="comment"><p className="muted">{c.authorName}</p><p>{c.text}</p></div>
            )) : <p>No comments yet</p>}
            <form onSubmit={submitComment} className="form">
              <label>Write a comment<textarea value={comment} onChange={e=>setComment(e.target.value)} required/></label>
              <div className="form-actions"><button className="btn primary">Comment</button></div>
            </form>
          </section>
        </div>
      </div>
    </article>
  )
}
