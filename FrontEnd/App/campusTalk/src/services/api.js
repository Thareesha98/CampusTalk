export async function apiFetch(path, opts = {}){
const token = localStorage.getItem('token');
const headers = opts.headers || {};
headers['Content-Type'] = headers['Content-Type'] || 'application/json';
if(token) headers['Authorization'] = `Bearer ${token}`;
const res = await fetch(path, { ...opts, headers });
if(res.status === 401){
// handle auth globally
localStorage.removeItem('token');
}
return res;
}