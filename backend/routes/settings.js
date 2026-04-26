const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const AdmZip = require('adm-zip');
const multer = require('multer');
const { dbRun, dbGet, dbAll } = require('../database/helpers');
const authMiddleware = require('../middleware/auth');

// Configure multer for zip upload (temp storage)
const upload = multer({
  dest: path.join(__dirname, '../data/tmp'),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Only .zip files are allowed'));
    }
  }
});

// GET /api/settings/export - Download all content as a zip
router.get('/export', authMiddleware, async (req, res) => {
  try {
    // Gather all content data
    const projects = await dbAll('SELECT * FROM projects ORDER BY display_order');
    const videos = await dbAll('SELECT * FROM videos ORDER BY display_order');
    const content = await dbAll('SELECT * FROM content');

    const exportData = {
      exportedAt: new Date().toISOString(),
      projects,
      videos,
      content
    };

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=site-content-export.zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      throw err;
    });
    archive.pipe(res);

    // Add JSON data
    archive.append(JSON.stringify(exportData, null, 2), { name: 'data.json' });

    // Add uploaded images
    const uploadsDir = path.join(__dirname, '../uploads');
    if (fs.existsSync(uploadsDir)) {
      archive.directory(uploadsDir, 'uploads');
    }

    // Add public images referenced by projects (img/ paths from seed data)
    // These are served from the vue public folder, but projects may reference them
    // We include any uploaded files — public static images are part of the app, not content

    await archive.finalize();
  } catch (error) {
    console.error('Export error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to export content' });
    }
  }
});

// POST /api/settings/import - Upload a zip and restore content
router.post('/import', authMiddleware, upload.single('file'), async (req, res) => {
  const tmpFile = req.file ? req.file.path : null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const zip = new AdmZip(tmpFile);
    const dataEntry = zip.getEntry('data.json');

    if (!dataEntry) {
      return res.status(400).json({ error: 'Invalid export file: missing data.json' });
    }

    const exportData = JSON.parse(dataEntry.getData().toString('utf8'));

    // Validate structure
    if (!exportData.projects || !exportData.videos || !exportData.content) {
      return res.status(400).json({ error: 'Invalid export file: missing required data' });
    }

    // --- Restore uploads ---
    const uploadsDir = path.join(__dirname, '../uploads');
    // Clear existing uploads
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        fs.unlinkSync(path.join(uploadsDir, file));
      }
    } else {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Extract uploads from zip
    const zipEntries = zip.getEntries();
    for (const entry of zipEntries) {
      if (entry.entryName.startsWith('uploads/') && !entry.isDirectory) {
        const filename = path.basename(entry.entryName);
        // Sanitize filename to prevent path traversal
        if (filename && !filename.includes('..') && !filename.includes('/')) {
          fs.writeFileSync(path.join(uploadsDir, filename), entry.getData());
        }
      }
    }

    // --- Restore database content ---
    // Clear existing content tables (not users)
    await dbRun('DELETE FROM projects');
    await dbRun('DELETE FROM videos');
    await dbRun('DELETE FROM content');

    // Restore projects
    for (const p of exportData.projects) {
      await dbRun(`
        INSERT INTO projects (id, title, description, role, year, image, url, display_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [p.id, p.title, p.description, p.role, p.year, p.image, p.url, p.display_order, p.created_at, p.updated_at]);
    }

    // Restore videos
    for (const v of exportData.videos) {
      await dbRun(`
        INSERT INTO videos (id, url, title, display_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [v.id, v.url, v.title, v.display_order, v.created_at, v.updated_at]);
    }

    // Restore content
    for (const c of exportData.content) {
      await dbRun(`
        INSERT INTO content (id, key, value, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `, [c.id, c.key, c.value, c.created_at, c.updated_at]);
    }

    res.json({
      message: 'Content imported successfully',
      imported: {
        projects: exportData.projects.length,
        videos: exportData.videos.length,
        content: exportData.content.length
      }
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import content' });
  } finally {
    // Clean up temp file
    if (tmpFile && fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  }
});

module.exports = router;
