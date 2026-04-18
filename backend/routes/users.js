const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');
const { dbRun, dbGet, dbAll } = require('../database/helpers');

// All routes require auth + admin
router.use(authMiddleware, adminOnly);

// GET /api/users - List all users
router.get('/', async (req, res) => {
  try {
    const users = await dbAll('SELECT id, username, email, is_admin, created_at FROM users ORDER BY created_at');
    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await dbGet('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await dbRun(
      'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, 0)',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      id: result.lastID,
      username,
      email,
      is_admin: 0
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /api/users/:id/reset-password - Reset a user's password
router.put('/:id/reset-password', async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.params.id;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbRun('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.json({ message: `Password reset for ${user.username}` });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Prevent deleting yourself
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await dbRun('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: `User ${user.username} deleted` });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
