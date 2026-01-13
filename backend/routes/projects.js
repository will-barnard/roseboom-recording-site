const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { dbRun, dbGet, dbAll } = require('../database/helpers');
const authMiddleware = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await dbAll('SELECT * FROM projects ORDER BY display_order, created_at DESC');
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project (admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, role, year, url, display_order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await dbRun(`
      INSERT INTO projects (title, description, role, year, image, url, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || null,
      role || null,
      year || null,
      imagePath,
      url || null,
      display_order || 0
    ]);

    const newProject = await dbGet('SELECT * FROM projects WHERE id = ?', [result.lastID]);

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project (admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, role, year, url, display_order } = req.body;
    const projectId = req.params.id;

    // Get existing project
    const existingProject = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
    
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // If new image uploaded, delete old one
    if (req.file && existingProject.image && existingProject.image.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, '..', existingProject.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : existingProject.image;

    await dbRun(`
      UPDATE projects 
      SET title = ?, description = ?, role = ?, year = ?, image = ?, url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || existingProject.title,
      description !== undefined ? description : existingProject.description,
      role !== undefined ? role : existingProject.role,
      year !== undefined ? year : existingProject.year,
      imagePath,
      url !== undefined ? url : existingProject.url,
      display_order !== undefined ? display_order : existingProject.display_order,
      projectId
    ]);

    const updatedProject = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete image file if exists
    if (project.image && project.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await dbRun('DELETE FROM projects WHERE id = ?', [projectId]);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Reorder projects (admin only)
router.post('/reorder', authMiddleware, async (req, res) => {
  try {
    const { projectIds } = req.body; // Array of project IDs in new order

    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ error: 'projectIds must be an array' });
    }

    for (let i = 0; i < projectIds.length; i++) {
      await dbRun('UPDATE projects SET display_order = ? WHERE id = ?', [i, projectIds[i]]);
    }

    res.json({ message: 'Projects reordered successfully' });
  } catch (error) {
    console.error('Reorder projects error:', error);
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
});

module.exports = router;
