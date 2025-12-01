const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/feedback - Submit feedback (logged-in users only)
router.post('/', authMiddleware, async(req, res) => {
    try {
        const { rating, comment } = req.body;
        const userId = req.user._id;

        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required" });
        }

        const feedback = new Feedback({
            userId,
            rating,
            comment,
        });

        await feedback.save();

        res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/feedback - Get all feedbacks (admins only)
router.get('/', authMiddleware, async(req, res) => {
    try {
        // Make sure req.user.isAdmin is reliable by fixing authMiddleware
        if (!req.user.isAdmin && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        const feedbacks = await Feedback.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ feedbacks });
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT /api/feedback/:id - Update feedback status and reply (admins only)
router.put('/:id', authMiddleware, async(req, res) => {
    try {
        if (!req.user.isAdmin && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        const { id } = req.params;
        const { status, reply } = req.body;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        if (status) feedback.status = status;
        if (reply) feedback.reply = reply;

        await feedback.save();

        res.json({ message: "Feedback updated successfully", feedback });
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/user', authMiddleware, async(req, res) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error("Error fetching user feedbacks:", error);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;