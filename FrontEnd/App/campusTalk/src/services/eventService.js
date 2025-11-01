import { apiFetch } from './api.js'
export async function fetchEvents(){ const res = await apiFetch('/api/events'); if(res.ok) return res.json(); return [] }
export async function fetchEvent(id){ const res = await apiFetch(`/api/events/${id}`); if(res.ok) return res.json(); throw new Error('Not found') }
export async function rsvpEvent(id){ const res = await apiFetch(`/api/events/${id}/rsvp`, { method:'POST' }); if(res.ok) return res.json(); throw new Error('RSVP failed') }
