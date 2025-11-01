// Simple API wrapper that attaches JWT token if present
export async function apiFetch(path, opts = {}){
  const token = localStorage.getItem('token')
  const headers = opts.headers ? {...opts.headers} : {}
  if(!headers['Content-Type'] && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  if(token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(path, {...opts, headers})
  if(res.status === 401){
    // handle global unauthorized
    localStorage.removeItem('token')
  }
  return res
}
