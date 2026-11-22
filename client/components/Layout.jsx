// Layout.jsx
// Shared header and navigation. Shows Sign in / Sign up when logged out,
// and the user's name, role and a Sign out button when logged in.

import { NavLink, useNavigate } from 'react-router-dom';
import '../src/App.css';
import '../src/crud.css';
import { useAuth } from '../src/AuthContext';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/education', label: 'Education' },
  { path: '/services', label: 'Services' },
  { path: '/project', label: 'Project' },
  { path: '/contact', label: 'Contact' },
];

export default function Layout() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  async function handleSignout() {
    await signout();
    navigate('/');
  }

  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="site-header">
      <div className="brand">
        <div className="logo">SS</div>
        <h1>My Portfolio</h1>
      </div>

      <nav className="main-nav">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'} className={linkClass}>
            {item.label}
          </NavLink>
        ))}

        {!user && (
          <>
            <NavLink to="/signin" className={linkClass}>Sign in</NavLink>
            <NavLink to="/signup" className={linkClass}>Sign up</NavLink>
          </>
        )}

        {user && (
          <>
            <span className="user-badge">{user.name} ({user.role})</span>
            <button className="signout-btn" onClick={handleSignout}>Sign out</button>
          </>
        )}
      </nav>
    </header>
  );
}
