const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// GET all quotes
router.get('/', async (req, res) => {
    const quotes = await Quote.find();
    res.json(quotes);
});

// GET a single quote
router.get('/:id', async (req, res) => {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
});

// POST create a quote
router.post('/', async (req, res) => {
    const { text, author } = req.body;
    const quote = new Quote({ text, author });
    await quote.save();
    res.status(201).json(quote);
});

// PUT update a quote
router.put('/:id', async (req, res) => {
    const { text, author } = req.body;
    const quote = await Quote.findByIdAndUpdate(
        req.params.id,
        { text, author },
        { new: true }
    );
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
});

// DELETE a quote
router.delete('/:id', async (req, res) => {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json({ message: 'Quote deleted' });
});

module.exports = router;