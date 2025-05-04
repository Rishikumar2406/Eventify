const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name");
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new event
router.post("/", async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get events created by the current user
router.get("/myevents", async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id });
    res.json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get events the user has registered for
router.get("/registered", async (req, res) => {
  try {
    const events = await Event.find({ registrations: req.user.id });
    res.json(events);
  } catch (error) {
    console.error("Error fetching registered events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Register for an event
router.post("/:id/register", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    if (!event.registrations.includes(req.user.id)) {
      event.registrations.push(req.user.id);
      await event.save();
    }
    
    res.json({ message: "Registered successfully" });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// NEW ENDPOINT: Cancel registration for an event
router.delete("/:id/register", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Check if user is registered
    if (event.registrations.includes(req.user.id)) {
      // Remove user from registrations array
      event.registrations = event.registrations.filter(
        userId => userId.toString() !== req.user.id.toString()
      );
      await event.save();
      res.json({ message: "Registration cancelled successfully" });
    } else {
      res.status(400).json({ message: "You are not registered for this event" });
    }
  } catch (error) {
    console.error("Error cancelling registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name");
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update event
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, description, date } = req.body;
    event.title = title;
    event.description = description;
    event.date = date;

    await event.save();
    res.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Delete an event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;