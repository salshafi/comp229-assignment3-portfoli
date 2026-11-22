// One place for every call to the backend (API consumption).
export const API = 'http://localhost:3000'

export async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  try { data = await res.json() } catch { /* empty body */ }

  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
  return data
}
