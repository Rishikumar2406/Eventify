import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "./Events.css"; // You'll need to create this CSS file

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Get all events
        const { data } = await API.get("/events");
        setEvents(data);
        
        // If user is logged in, get their registered events to determine registration status
        if (user) {
          const { data: registeredEvents } = await API.get("/events/registered");
          // Extract just the IDs of events the user has registered for
          setRegisteredEventIds(registeredEvents.map(event => event._id));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [user]);

  const handleRegister = async (eventId) => {
    if (!user) {
      // Redirect to login if not logged in
      navigate("/login", { state: { redirectAfterLogin: `/events` } });
      return;
    }

    try {
      // Register for the event
      await API.post(`/events/${eventId}/register`);
      
      // Update the local state to reflect the new registration
      setRegisteredEventIds(prev => [...prev, eventId]);
      
      alert("Successfully registered for event!");
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Failed to register for event. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) return <div className="events-loading">Loading events...</div>;
  if (error) return <div className="events-error">{error}</div>;

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <p className="no-events">No events are currently scheduled.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const isRegistered = registeredEventIds.includes(event._id);
            
            return (
              <div key={event._id} className="event-card">
                <h2 className="event-title">{event.title}</h2>
                <p className="event-date">{formatDate(event.date)}</p>
                <p className="event-description">{event.description}</p>
                
                {user ? (
                  isRegistered ? (
                    <div className="registration-status registered">
                      <span className="checkmark">✓</span> You're registered
                    </div>
                  ) : (
                    <button 
                      className="register-button"
                      onClick={() => handleRegister(event._id)}
                    >
                      Register Now
                    </button>
                  )
                ) : (
                  <Link to="/login" className="login-prompt">Login to register</Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;