import React, { useState } from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateEvent from "./pages/CreateEvent";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events"; // Add this import
import Settings from "./pages/Settings";
import EditEvent from "./pages/EditEvent";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

const Nav = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-text">EVENTIFY</span>
          </Link>
        </div>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/events" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>
            Events
          </NavLink>
        </div>

        <div className={`auth-links ${menuOpen ? 'active' : ''}`}>
          {user ? (
            <div className="user-menu">
              <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>
                Dashboard
              </NavLink>
              {user.role === 'organizer' && (
                <NavLink to="/create-event" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>
                  Create Event
                </NavLink>
              )}
              <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>
                Settings
              </NavLink>
              <button onClick={() => {logout(); closeMenu();}} className="logout-button">Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/login" className="nav-item" onClick={closeMenu}>Login</NavLink>
              <NavLink to="/register" className="nav-item" onClick={closeMenu}>Register</NavLink>
            </div>
          )}
        </div>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

const App = () => (
  <AuthProvider>
    <div className="app">
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/events" element={<Events />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
        </Routes>
      </main>
    </div>
  </AuthProvider>
);

export default App;