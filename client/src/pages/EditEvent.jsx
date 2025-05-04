import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css"; // Keep consistent styling

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await API.get(`/events/${id}`);
        setEvent({
          title: data.title,
          description: data.description,
          date: new Date(data.date).toISOString().slice(0, 16),
        });
        setLoading(false);
      } catch (err) {
        setError("Unable to load event.");
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/events/${id}`, event);
      alert("Event updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to update event.");
    }
  };

  if (loading) return <div className="dashboard-loading">Loading event...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Edit Event</h2>
      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Title</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={event.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date and Time</label>
          <input
            type="datetime-local"
            name="date"
            className="form-input"
            value={event.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-textarea"
            value={event.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="create-event-btn">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
