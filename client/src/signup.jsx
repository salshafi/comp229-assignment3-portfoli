import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import './crud.css'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function validate() {
    const found = {}
    if (!form.name.trim()) found.name = 'Name is required'
    if (!form.email.trim()) found.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) found.email = 'Email format is invalid'
    if (form.password.length < 6) found.password = 'Password must be at least 6 characters'
    if (form.confirm !== form.password) found.confirm = 'Passwords do not match'
    return found
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const found = validate()
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }
    try {
      await signup(form.name.trim(), form.email.trim(), form.password)
      navigate('/signin')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <h2>Sign up</h2>
      {serverError && <p className="notice error">{serverError}</p>}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
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
        <div className="form-field">
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} />
          {errors.confirm && <p className="form-error">{errors.confirm}</p>}
        </div>
        <button type="submit">Create account</button>
      </form>
      <p>
        Already registered? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  )
}
