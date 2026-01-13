const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../database/helpers');
const authMiddleware = require('../middleware/auth');

// Get all videos (public)
router.get('/', async (req, res) => {
  try {
    const videos = await dbAll('SELECT * FROM videos ORDER BY display_order, created_at DESC');
    res.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get single video (public)
router.get('/:id', async (req, res) => {
  try {
    const video = await dbGet('SELECT * FROM videos WHERE id = ?', [req.params.id]);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// Create video (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { url, title, display_order } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = await dbRun(`
      INSERT INTO videos (url, title, display_order)
      VALUES (?, ?, ?)
    `, [
      url,
      title || null,
      display_order || 0
    ]);

    const newVideo = await dbGet('SELECT * FROM videos WHERE id = ?', [result.lastID]);

    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// Update video (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { url, title, display_order } = req.body;
    const videoId = req.params.id;

    // Get existing video
    const existingVideo = await dbGet('SELECT * FROM videos WHERE id = ?', [videoId]);
    
    if (!existingVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await dbRun(`
      UPDATE videos 
      SET url = ?, title = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      url !== undefined ? url : existingVideo.url,
      title !== undefined ? title : existingVideo.title,
      display_order !== undefined ? display_order : existingVideo.display_order,
      videoId
    ]);

    const updatedVideo = await dbGet('SELECT * FROM videos WHERE id = ?', [videoId]);

    res.json(updatedVideo);
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// Delete video (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await dbGet('SELECT * FROM videos WHERE id = ?', [videoId]);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await dbRun('DELETE FROM videos WHERE id = ?', [videoId]);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Reorder videos (admin only)
router.post('/reorder', authMiddleware, async (req, res) => {
  try {
    const { videoIds } = req.body; // Array of video IDs in new order

    if (!Array.isArray(videoIds)) {
      return res.status(400).json({ error: 'videoIds must be an array' });
    }

    for (let i = 0; i < videoIds.length; i++) {
      await dbRun('UPDATE videos SET display_order = ? WHERE id = ?', [i, videoIds[i]]);
    }

    res.json({ message: 'Videos reordered successfully' });
  } catch (error) {
    console.error('Reorder videos error:', error);
    res.status(500).json({ error: 'Failed to reorder videos' });
  }
});

module.exports = router;
