const db = require('./db');
const bcrypt = require('bcryptjs');

// Promisify database methods for easier async/await usage
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Create tables
const createTables = async () => {
  // Users table
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Featured projects table
  await run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      role TEXT,
      year TEXT,
      image TEXT,
      url TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Videos table
  await run(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      title TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Tables created successfully');
};

// Seed data
const seedData = async () => {
  try {
    // Create admin user (username: admin, password: admin123)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const checkUser = await get('SELECT * FROM users WHERE username = ?', ['admin']);
    
    if (!checkUser) {
      await run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        ['admin', 'admin@roseboom.com', hashedPassword]);
      console.log('Admin user created (username: admin, password: admin123)');
    }

    // Seed initial featured projects from existing data
    const existingProjects = await get('SELECT COUNT(*) as count FROM projects');
    
    if (existingProjects.count === 0) {
      const projects = [
        {
          title: "Hannah Frey - Lucky Girl",
          role: "Engineer, Mix",
          year: "2024",
          description: "This is the description for project 1",
          image: "img/lucky_girl.jpg",
          url: "https://www.google.com",
          display_order: 1
        },
        {
          title: "Wild Daisies - Water Under the Bridge / Evergreen Paradigm (Single)",
          description: "This is the description for project 2",
          role: "Producer, Engineer, Mix, Performance",
          year: "2024",
          image: "img/daisies_2024.png",
          url: "https://www.google.com",
          display_order: 2
        },
        {
          title: "Risk Watch - Work From Home",
          description: "This is the description for project 3",
          image: "img/rw.png",
          url: "https://www.google.com",
          display_order: 3
        },
        {
          title: "Men Slowing Down - MSD1 (LP)",
          description: "This is the description for project 4",
          role: "Engineer, Mix, Master",
          year: "2023",
          image: "img/MSDfinalAlbumCover.png",
          url: "https://www.google.com",
          display_order: 4
        },
        {
          title: "Marvin Stumbles - Seasons (LP)",
          description: "This is the description for project 5",
          role: "Producer, Engineer, Mix, Performance",
          year: "2022",
          image: "img/MarvinStumbles_Seasons.png",
          url: "https://www.google.com",
          display_order: 5
        },
        {
          title: "Wild Daisies - Blue Bird / Far Out (Single)",
          description: "This is the description for project 6",
          role: "Producer, Engineer, Mix, Master, Performance",
          year: "2022",
          image: "img/WildDaisies_BlueBirdFarOut.png",
          url: "https://www.google.com",
          display_order: 6
        },
        {
          title: "Marvin Stumbles - Drawing Lines (LP)",
          description: "This is the description for project 7",
          role: "Engineer, Mix, Master",
          year: "2021",
          image: "img/MarvinStumbles_DrawingLines.png",
          url: "https://www.google.com",
          display_order: 7
        }
      ];

      for (const project of projects) {
        await run(`
          INSERT INTO projects (title, description, role, year, image, url, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          project.title,
          project.description,
          project.role || null,
          project.year || null,
          project.image,
          project.url,
          project.display_order
        ]);
      }

      console.log('Featured projects seeded successfully');
    }

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Initialize database
const initDatabase = async () => {
  try {
    await createTables();
    await seedData();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    db.close();
  }
};

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
