-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT,
  bio TEXT,
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist_id INTEGER,
  release_date DATE,
  cover_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id)
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist_id INTEGER,
  album_id INTEGER,
  duration INTEGER,
  file_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ts TEXT,
  username TEXT,
  platform TEXT,
  ms_played INTEGER,
  conn_country TEXT,
  ip_addr_decrypted TEXT,
  user_agent_decrypted TEXT,
  master_metadata_track_name TEXT,
  master_metadata_album_artist_name TEXT,
  master_metadata_album_album_name TEXT,
  terratune_track_uri TEXT UNIQUE,
  episode_name TEXT,
  episode_show_name TEXT,
  terratune_episode_uri TEXT,
  reason_start TEXT,
  reason_end TEXT,
  shuffle BOOLEAN,
  skipped BOOLEAN,
  offline BOOLEAN,
  offline_timestamp INTEGER,
  incognito_mode BOOLEAN,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Playlist tracks junction table
CREATE TABLE IF NOT EXISTS playlist_tracks (
  playlist_id INTEGER,
  track_id INTEGER,
  position INTEGER,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (playlist_id, track_id),
  FOREIGN KEY (playlist_id) REFERENCES playlists(id),
  FOREIGN KEY (track_id) REFERENCES tracks(id)
);

-- User follows table
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id)
);

-- Artist follows table
CREATE TABLE IF NOT EXISTS artist_follows (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, artist_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id ON playlist_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_artist_follows_user_id ON artist_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_follows_artist_id ON artist_follows(artist_id);

-- Remove old test data insertion logic
-- The new programmatic insertion will handle sample data 