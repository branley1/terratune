import express from 'express';
import { getDb } from '../db/index.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user's playlists
router.get('/user/:userId', auth, (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is accessing their own playlists
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Not authorized to access these playlists' });
    }
    
    const db = getDb();
    const stmt = db.prepare(`
      SELECT *
      FROM playlists
      WHERE user_id = ?
    `);
    const result = stmt.all(userId);
    
    const playlists = result.length > 0 ? result[0].values.map(playlist => ({
      id: playlist[0],
      user_id: playlist[1],
      title: playlist[2],
      description: playlist[3],
      is_public: Boolean(playlist[4]),
      created_at: playlist[5],
      updated_at: playlist[6]
    })) : [];
    
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get playlist by ID with tracks
router.get('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    // Get playlist info
    const stmt = db.prepare(`
      SELECT *
      FROM playlists
      WHERE id = ?
    `);
    const playlistResult = stmt.all(id);
    
    if (playlistResult.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    const playlist = playlistResult[0].values[0];
    
    // Check if playlist is private and user is not the owner
    if (!Boolean(playlist[4]) && req.user.id !== playlist[1]) {
      return res.status(403).json({ error: 'Not authorized to access this playlist' });
    }
    
    // Get playlist tracks
    const tracksStmt = db.prepare(`
      SELECT t.*, pt.position
      FROM tracks t
      JOIN playlist_tracks pt ON t.id = pt.track_id
      WHERE pt.playlist_id = ?
      ORDER BY pt.position
    `);
    const tracksResult = tracksStmt.all(id);
    
    const playlistData = {
      id: playlist[0],
      user_id: playlist[1],
      title: playlist[2],
      description: playlist[3],
      is_public: Boolean(playlist[4]),
      created_at: playlist[5],
      updated_at: playlist[6],
      tracks: tracksResult.length > 0 ? tracksResult[0].values.map(track => ({
        id: track[0],
        title: track[1],
        artist_id: track[2],
        album_id: track[3],
        duration: track[4],
        file_url: track[5],
        created_at: track[6],
        position: track[7]
      })) : []
    };
    
    res.json(playlistData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new playlist
router.post('/', auth, (req, res) => {
  try {
    const { title, description, is_public } = req.body;
    const db = getDb();
    
    const stmt = db.prepare(`
      INSERT INTO playlists (user_id, title, description, is_public)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(req.user.id, title, description, is_public ? 1 : 0);
    
    const newPlaylistId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    
    res.status(201).json({
      id: newPlaylistId,
      user_id: req.user.id,
      title,
      description,
      is_public,
      tracks: []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add track to playlist
router.post('/:id/tracks', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { track_id, position } = req.body;
    const db = getDb();
    
    // Check if user owns the playlist
    const stmt = db.prepare(`
      SELECT user_id
      FROM playlists
      WHERE id = ?
    `);
    const playlistResult = stmt.all(id);
    
    if (playlistResult.length === 0) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    if (req.user.id !== playlistResult[0].values[0][0]) {
      return res.status(403).json({ error: 'Not authorized to modify this playlist' });
    }
    
    const trackStmt = db.prepare(`
      INSERT INTO playlist_tracks (playlist_id, track_id, position)
      VALUES (?, ?, ?)
    `);
    trackStmt.run(id, track_id, position);
    
    res.status(201).json({ message: 'Track added to playlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 