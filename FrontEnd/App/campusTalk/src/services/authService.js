import { apiFetch } from './api.js'

export async function login(credentials){
  const res = await apiFetch('/api/auth/login', { method:'POST', body: JSON.stringify(credentials) })
  if(res.ok) return res.json()
  throw new Error('Login failed')
}

export async function register(payload){
  const res = await apiFetch('/api/auth/register', { method:'POST', body: JSON.stringify(payload) })
  if(res.ok) return res.json()
  throw new Error('Register failed')
}

export function setToken(token){ localStorage.setItem('token', token) }
export function getToken(){ return localStorage.getItem('token') }
export function logout(){ localStorage.removeItem('token') }
