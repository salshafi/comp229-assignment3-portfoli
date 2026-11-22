import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import './crud.css'

export default function Signin() {
  const { signin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const found = {}
    if (!form.email.trim()) found.email = 'Email is required'
    if (!form.password) found.password = 'Password is required'
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }
    try {
      await signin(form.email.trim(), form.password)
      navigate('/')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <h2>Sign in</h2>
      {serverError && <p className="notice error">{serverError}</p>}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>
        <button type="submit">Sign in</button>
      </form>
      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  )
}
