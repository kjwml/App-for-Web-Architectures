const authFetch = async (input: RequestInfo, init: RequestInit = {}) => {
  const token = localStorage.getItem('authToken')
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(input, { ...init, headers })
  if (response.status === 401) {
    localStorage.removeItem('authToken')
    window.location.href = '/login'
  }
  return response
}

export default authFetch
