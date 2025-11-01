import { apiFetch } from './api.js'
export async function fetchClubs(){ const res = await apiFetch('/api/clubs'); if(res.ok) return res.json(); return [] }
export async function fetchClub(id){ const res = await apiFetch(`/api/clubs/${id}`); if(res.ok) return res.json(); throw new Error('Not found') }
export async function joinClub(id){ const res = await apiFetch(`/api/clubs/${id}/join`, { method:'POST' }); if(res.ok) return res.json(); throw new Error('Join failed') }
