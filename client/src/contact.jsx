// contact.jsx
// Contact form (controlled, with validation) that now SAVES to the backend,
// plus a list of saved messages: signed-in users can view, admin can edit/delete.

import { useState } from 'react';
import { request } from './api';
import CrudPage from './CrudPage';

const listFields = [
  { name: 'firstname', label: 'First name', required: true },
  { name: 'lastname', label: 'Last name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'message', label: 'Message', type: 'textarea' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [refreshKey, setRefreshKey] = useState(0);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      // Backend field names are lowercase (firstname / lastname)
      await request('/api/contacts', {
        method: 'POST',
        body: {
          firstname: formData.firstName.trim(),
          lastname: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        },
      });
      setStatus({ type: 'ok', text: 'Thanks for reaching out! Your message was saved.' });
      setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  }

  return (
    <div className="contact-page">
      <h2>Contact</h2>

      <div className="contact-info">
        <p>
          Email: <a href="mailto:salshafi44@gmail.com">salshafi44@gmail.com</a>
        </p>
        <p>
          LinkedIn:{' '}
          <a href="https://linkedin.com/in/salmanshafi44" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/salmanshafi44
          </a>
        </p>
      </div>

      {status.text && <p className={`notice ${status.type}`}>{status.text}</p>}

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} />
          {errors.message && <p className="form-error">{errors.message}</p>}
        </div>

        <button type="submit">Send</button>
      </form>

      <CrudPage
        title="Saved messages"
        endpoint="/api/contacts"
        fields={listFields}
        requireSignin
        allowCreate={false}
        refreshKey={refreshKey}
      />
    </div>
  );
}
