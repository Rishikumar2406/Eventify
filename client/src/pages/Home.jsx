import React, { useEffect, useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

// Icon components
const CalendarPlusIcon = () => (
  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="12" y1="10" x2="12" y2="16" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
  </svg>
);

const CheckboxIcon = () => (
  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const CalendarCheckIcon = () => (
  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M9 16l2 2 4-4" />
  </svg>
);

const Home = () => {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get("/events");
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
        <h1 className="hero-title">Welcome{user ? `, ${user.name}` : ""}!</h1>
          <p className="hero-description">
          <span className="highlight-app-name">Eventify</span> is your all-in-one platform for managing events with ease and efficiency. Whether you're organizing a tech meetup, workshop, cultural event, or seminar — our user-friendly dashboard helps you handle everything in one place.
          </p>
          <Link to="/events" className="cta-button">EXPLORE EVENTS</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        {/* <h2 className="section-title">HTML models</h2> */}
        
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <CalendarPlusIcon />
            <h3 className="feature-title">CREATE EVENT</h3>
            <p className="feature-description">Add a new event to the list.</p>
            {user && <Link to="/create-event" className="feature-link">Create Now</Link>}
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <CheckboxIcon />
            <h3 className="feature-title">REGISTER FOR EVENT</h3>
            <p className="feature-description">Sign up to attend an event.</p>
            <Link to="/events" className="feature-link">View Events</Link>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <CalendarCheckIcon />
            <h3 className="feature-title">REGISTERED EVENTS</h3>
            <p className="feature-description">View events you have signed up for.</p>
            {user && <Link to="/dashboard" className="feature-link">View My Events</Link>}
          </div>
        </div>
      </section>

      {/* Events Section - Only shown if there are events */}
      {events.length > 0 && (
        <section className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="events-list">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
                {user ? (
                  <button className="register-button" onClick={() => navigate(`/Events`)}>Register Now</button>
                ) : (
                  <Link to="/login" className="login-prompt">Login to register</Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;