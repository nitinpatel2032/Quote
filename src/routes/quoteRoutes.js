const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// GET random daily quote
router.get('/daily', async (req, res) => {
    try {
        const count = await Quote.countDocuments();
        if (count === 0) return res.status(404).json({ error: 'No quotes available' });

        const random = Math.floor(Math.random() * count);
        const quote = await Quote.findOne().skip(random);
        res.json(quote);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all quotes
router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: 1 });
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET a single quote by ID
router.get('/:id', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) return res.status(404).json({ error: 'Quote not found' });
        res.json(quote);
    } catch (err) {
        res.status(500).json({ error: 'Invalid ID format or server error' });
    }
});

// POST create a new quote
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        if (Array.isArray(data)) {
            const result = await Quote.insertMany(data);
            return res.status(201).json({ message: `${result.length} quotes created successfully`, data: result });
        } else if (data.text) {
            const quote = new Quote(data);
            await quote.save();
            return res.status(201).json({ message: 'Single quote created', quote });
        } else {
            return res.status(400).json({ error: 'Invalid payload' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update an existing quote
router.put('/:id', async (req, res) => {
    try {
        const { text, author, tags } = req.body;
        const updateData = {};
        if (text) updateData.text = text;
        if (author) updateData.author = author;
        if (tags) updateData.tags = tags;

        const quote = await Quote.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!quote) return res.status(404).json({ error: 'Quote not found' });
        res.json({ message: 'Quote updated successfully', quote });
    } catch (err) {
        res.status(500).json({ error: 'Invalid ID format or server error' });
    }
});

// DELETE a quote
router.delete('/:id', async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if (!quote) return res.status(404).json({ error: 'Quote not found' });
        res.json({ message: 'Quote deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Invalid ID format or server error' });
    }
});

module.exports = router;