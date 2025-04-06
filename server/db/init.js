import { getDb } from './index.js';

export const initDatabase = async () => {
  const db = getDb();
  
  // Create tables if they don't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT,
      bio TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      bio TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist_id INTEGER,
      release_date DATE,
      cover_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (artist_id) REFERENCES artists(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist_id INTEGER,
      album_id INTEGER,
      duration INTEGER,
      file_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (artist_id) REFERENCES artists(id),
      FOREIGN KEY (album_id) REFERENCES albums(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      is_public BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS playlist_tracks (
      playlist_id INTEGER,
      track_id INTEGER,
      position INTEGER,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (playlist_id, track_id),
      FOREIGN KEY (playlist_id) REFERENCES playlists(id),
      FOREIGN KEY (track_id) REFERENCES tracks(id)
    )
  `);

  // Insert test data if tables are empty
  const usersCount = db.exec("SELECT COUNT(*) as count FROM users")[0].values[0][0];
  if (usersCount === 0) {
    // Insert test user with name
    db.run(`
      INSERT INTO users (username, email, password, name) 
      VALUES ('testuser', 'test@example.com', '$2a$10$X7J3QZqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq', 'Test User') 
    `);

    // Insert test artist
    db.run(`
      INSERT INTO artists (name, bio)
      VALUES ('Test Artist', 'A test artist for development')
    `);

    const artistId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];

    // Insert test album
    db.run(`
      INSERT INTO albums (title, artist_id)
      VALUES ('Test Album', ${artistId})
    `);

    const albumId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];

    // Insert test tracks
    db.run(`
      INSERT INTO tracks (title, artist_id, album_id, duration, file_url)
      VALUES 
        ('Test Track 1', ${artistId}, ${albumId}, 180, '/tracks/test1.mp3'),
        ('Test Track 2', ${artistId}, ${albumId}, 240, '/tracks/test2.mp3')
    `);
  }

  return db;
}; 