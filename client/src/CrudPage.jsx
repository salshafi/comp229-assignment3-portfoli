// Reusable list + form for one backend object (Education, Project, Contact).
// Everyone can VIEW. Only an admin sees the form and the Edit/Delete buttons.
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { request } from './api'
import { useAuth } from './AuthContext'
import './crud.css'

const EMAIL_RE = /\S+@\S+\.\S+/

export default function CrudPage({
  title,
  endpoint,
  fields,
  requireSignin = false,
  allowCreate = true,
  refreshKey = 0,
}) {
  const { token, isAdmin } = useAuth()
  const blank = Object.fromEntries(fields.map((f) => [f.name, '']))

  const [items, setItems] = useState([])
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await request(endpoint, { token }))
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
    }
    setLoading(false)
  }, [endpoint, token])

  useEffect(() => {
    if (requireSignin && !token) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load, requireSignin, token, refreshKey])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function validate() {
    const found = {}
    fields.forEach((f) => {
      const v = String(form[f.name] || '').trim()
      if (f.required && !v) found[f.name] = `${f.label} is required`
      else if (f.type === 'email' && v && !EMAIL_RE.test(v)) found[f.name] = 'Email format is invalid'
    })
    return found
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const found = validate()
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }
    const body = {}
    fields.forEach((f) => {
      const v = String(form[f.name] || '').trim()
      if (v !== '') body[f.name] = v
    })
    try {
      if (editingId) {
        await request(`${endpoint}/${editingId}`, { method: 'PUT', body, token })
        setNotice({ type: 'ok', text: 'Updated.' })
      } else {
        await request(endpoint, { method: 'POST', body, token })
        setNotice({ type: 'ok', text: 'Saved.' })
      }
      setForm(blank)
      setEditingId(null)
      setErrors({})
      load()
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
    }
  }

  function startEdit(item) {
    const next = {}
    fields.forEach((f) => {
      const v = item[f.name] ?? ''
      next[f.name] = f.type === 'date' && v ? String(v).slice(0, 10) : v
    })
    setForm(next)
    setEditingId(item._id)
    setErrors({})
    setNotice({ type: '', text: '' })
  }

  function cancelEdit() {
    setForm(blank)
    setEditingId(null)
    setErrors({})
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this record?')) return
    try {
      await request(`${endpoint}/${id}`, { method: 'DELETE', token })
      setNotice({ type: 'ok', text: 'Deleted.' })
      load()
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
    }
  }

  const showForm = isAdmin && (allowCreate || editingId)

  return (
    <section className="crud-section">
      <h2>{title}</h2>

      {requireSignin && !token && (
        <p className="notice">
          Please <Link to="/signin">sign in</Link> to view this list.
        </p>
      )}

      {notice.text && <p className={`notice ${notice.type}`}>{notice.text}</p>}

      {showForm && (
        <form className="crud-form" onSubmit={handleSubmit} noValidate>
          <h3>{editingId ? 'Edit record' : 'Add a record'}</h3>
          {fields.map((f) => (
            <div className="form-field" key={f.name}>
              <label htmlFor={`${endpoint}-${f.name}`}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  id={`${endpoint}-${f.name}`}
                  name={f.name}
                  rows="3"
                  value={form[f.name]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  id={`${endpoint}-${f.name}`}
                  name={f.name}
                  type={f.type || 'text'}
                  value={form[f.name]}
                  onChange={handleChange}
                />
              )}
              {errors[f.name] && <p className="form-error">{errors[f.name]}</p>}
            </div>
          ))}
          <div className="btn-row">
            <button type="submit">{editingId ? 'Update' : 'Save'}</button>
            {editingId && (
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading && <p>Loading...</p>}
      {!loading && (!requireSignin || token) && items.length === 0 && <p>No records yet.</p>}

      {items.map((item) => (
        <div className="record-card" key={item._id}>
          {item.title && <h3>{item.title}</h3>}
          {fields
            .filter((f) => f.name !== 'title' && item[f.name])
            .map((f) => (
              <p key={f.name}>
                <strong>{f.label}:</strong>{' '}
                {f.type === 'date' ? String(item[f.name]).slice(0, 10) : item[f.name]}
              </p>
            ))}
          {isAdmin && (
            <div className="btn-row">
              <button className="btn-edit" onClick={() => startEdit(item)}>
                Edit
              </button>
              <button className="btn-danger" onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
