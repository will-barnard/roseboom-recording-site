const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const db = require('../database/db');

// Get home page content
router.get('/home', (req, res) => {
  try {
    const content = db.prepare('SELECT * FROM content WHERE key = ?').get('home_content');
    
    if (!content) {
      return res.json({ content: '' });
    }
    
    res.json({ content: content.value });
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update home page content (requires authentication)
router.put('/home', authenticate, (req, res) => {
  try {
    const { content } = req.body;
    
    if (content === undefined) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Check if content exists
    const existing = db.prepare('SELECT * FROM content WHERE key = ?').get('home_content');
    
    if (existing) {
      // Update existing content
      db.prepare('UPDATE content SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?')
        .run(content, 'home_content');
    } else {
      // Insert new content
      db.prepare('INSERT INTO content (key, value) VALUES (?, ?)')
        .run('home_content', content);
    }
    
    res.json({ message: 'Content updated successfully', content });
  } catch (error) {
    console.error('Error updating home content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

module.exports = router;
