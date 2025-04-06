import express from 'express';
import { getDb } from '../db/index.js';

const router = express.Router();

// Search tracks, artists, and playlists
router.get('/', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const db = getDb();
    const searchTerm = `%${q}%`;
    
    // Search tracks
    const tracksResult = db.exec(`
      SELECT t.*, a.name as artist_name, al.title as album_title
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.title LIKE '${searchTerm}'
         OR a.name LIKE '${searchTerm}'
         OR al.title LIKE '${searchTerm}'
    `);
    
    // Search artists
    const artistsResult = db.exec(`
      SELECT *
      FROM artists
      WHERE name LIKE '${searchTerm}'
    `);
    
    // Search public playlists
    const playlistsResult = db.exec(`
      SELECT p.*, u.username as creator_name
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_public = 1
        AND (p.title LIKE '${searchTerm}'
         OR p.description LIKE '${searchTerm}')
    `);
    
    const results = {
      tracks: tracksResult.length > 0 ? tracksResult[0].values.map(track => ({
        id: track[0],
        title: track[1],
        artist_id: track[2],
        album_id: track[3],
        duration: track[4],
        file_url: track[5],
        created_at: track[6],
        artist_name: track[7],
        album_title: track[8]
      })) : [],
      
      artists: artistsResult.length > 0 ? artistsResult[0].values.map(artist => ({
        id: artist[0],
        name: artist[1],
        bio: artist[2],
        image_url: artist[3],
        created_at: artist[4]
      })) : [],
      
      playlists: playlistsResult.length > 0 ? playlistsResult[0].values.map(playlist => ({
        id: playlist[0],
        user_id: playlist[1],
        title: playlist[2],
        description: playlist[3],
        is_public: Boolean(playlist[4]),
        created_at: playlist[5],
        updated_at: playlist[6],
        creator_name: playlist[7]
      })) : []
    };
    
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 