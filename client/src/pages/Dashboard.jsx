import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: created } = await API.get("/events/myevents");
        const { data: registered } = await API.get("/events/registered");
        setMyEvents(created);
        setRegisteredEvents(registered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load your events. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const cancelRegistration = async (eventId) => {
    try {
      await API.delete(`/events/${eventId}/register`);
      setRegisteredEvents(registeredEvents.filter((event) => event._id !== eventId));
      alert("Registration cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling registration:", error);
      alert("Failed to cancel registration. Please try again.");
    }
  };

  const deleteEvent = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/events/${eventId}`);
      setMyEvents(myEvents.filter((event) => event._id !== eventId));
      alert("Event deleted successfully.");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  if (loading) return <div className="dashboard-loading">Loading your events...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">My Dashboard</h1>

      {/* Created Events */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Events I've Created</h2>
          <Link to="/create-event" className="create-event-btn">Create New Event</Link>
        </div>

        {myEvents.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any events yet.</p>
            <Link to="/create-event" className="action-link">Create your first event</Link>
          </div>
        ) : (
          <div className="events-list created-events">
            {myEvents.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-details">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-datetime">
                    {formatDate(event.date)} at {formatTime(event.date)}
                  </p>
                  <p className="event-description">{event.description}</p>
                </div>
                <div className="event-actions">
                <button className="action-btn edit-btn" onClick={() => navigate(`/edit-event/${event._id}`)}>Edit</button>

                  <button className="action-btn delete-btn" onClick={() => deleteEvent(event._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Registered Events */}
      <section className="dashboard-section">
        <h2 className="section-title">Events I'm Attending</h2>

        {registeredEvents.length === 0 ? (
          <div className="empty-state">
            <p>You haven't registered for any events yet.</p>
            <Link to="/events" className="action-link">Browse available events</Link>
          </div>
        ) : (
          <div className="events-list registered-events">
            {registeredEvents.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-details">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-datetime">
                    {formatDate(event.date)} at {formatTime(event.date)}
                  </p>
                  <p className="event-description">{event.description}</p>
                </div>
                <div className="event-actions">
                  <button
                    className="action-btn cancel-btn"
                    onClick={() => cancelRegistration(event._id)}
                  >
                    Cancel Registration
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
