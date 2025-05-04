import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import "./Settings.css";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setForm(prevForm => ({
        ...prevForm,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    
    try {
      const { data } = await API.put("/users/profile", {
        name: form.name,
        email: form.email
      });
      
      updateUser(data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile." });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (form.newPassword !== form.confirmPassword) {
      return setMessage({ type: "error", text: "New passwords don't match." });
    }
    
    try {
      await API.put("/users/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      
      setForm({
        ...form,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setMessage({ type: "success", text: "Password changed successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to change password. Please check your current password." });
    }
  };

  if (!user) {
    return <div className="settings-container">Please login to access settings.</div>;
  }

  return (
    <div className="settings-container">
      <h1 className="settings-title">Account Settings</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="settings-card">
        <h2>Profile Information</h2>
        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="update-button">Update Profile</button>
        </form>
      </div>
      
      <div className="settings-card">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="update-button">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;