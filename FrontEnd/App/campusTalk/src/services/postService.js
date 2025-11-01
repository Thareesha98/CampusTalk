import { apiFetch } from './api.js'

export async function fetchPosts(){
  const res = await apiFetch('/api/posts')
  if(res.ok) return res.json()
  return []
}
export async function fetchPost(id){
  const res = await apiFetch(`/api/posts/${id}`)
  if(res.ok) return res.json()
  throw new Error('Not found')
}
export async function createPost(payload){
  const res = await apiFetch('/api/posts', { method:'POST', body: JSON.stringify(payload) })
  if(res.ok) return res.json()
  throw new Error('Create failed')
}
export async function commentPost(postId, payload){
  const res = await apiFetch(`/api/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(payload) })
  if(res.ok) return res.json()
  throw new Error('Comment failed')
}
