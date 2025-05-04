import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./CreateEvent.css"; // We'll create this CSS file next

const CreateEvent = () => {
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    date: "",
    time: "12:00", // Adding time field
    location: "", // Adding location field
    maxAttendees: "" // Adding maximum attendees field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Combine date and time
      const dateTime = new Date(`${form.date}T${form.time}`);
      
      // Create the submission object
      const eventData = {
        title: form.title,
        description: form.description,
        date: dateTime.toISOString(),
        location: form.location,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : undefined
      };
      
      await API.post("/events", eventData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Event creation failed:", err);
      setError("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <div className="create-event-card">
        <h1 className="create-event-title">Create New Event</h1>
        
        {error && <div className="create-event-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input 
              type="text" 
              id="title"
              name="title" 
              value={form.title}
              placeholder="Enter event title" 
              onChange={handleChange} 
              required 
              className="create-event-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              name="description" 
              value={form.description}
              placeholder="Describe your event" 
              onChange={handleChange} 
              required 
              className="create-event-textarea"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date"
                name="date" 
                value={form.date}
                onChange={handleChange} 
                required 
                className="create-event-input"
              />
            </div>
            
            <div className="form-group half">
              <label htmlFor="time">Time</label>
              <input 
                type="time" 
                id="time"
                name="time" 
                value={form.time}
                onChange={handleChange} 
                required 
                className="create-event-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input 
              type="text" 
              id="location"
              name="location" 
              value={form.location}
              placeholder="Enter event location" 
              onChange={handleChange} 
              className="create-event-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="maxAttendees">Maximum Attendees (Optional)</label>
            <input 
              type="number" 
              id="maxAttendees"
              name="maxAttendees" 
              value={form.maxAttendees}
              placeholder="Leave blank for unlimited" 
              onChange={handleChange} 
              min="1"
              className="create-event-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="create-event-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;