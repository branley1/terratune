import express from 'express';
import { getDb } from '../db/index.js';

const router = express.Router();

// Get all tracks
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const result = db.exec(`
      SELECT 
        t.id, t.title, t.artist_id, t.album_id, t.duration, t.file_url, t.created_at,
        t.ts, t.username, t.platform, t.ms_played, t.conn_country, t.ip_addr_decrypted,
        t.user_agent_decrypted, t.master_metadata_track_name, t.master_metadata_album_artist_name,
        t.master_metadata_album_album_name, t.terratune_track_uri, t.episode_name, t.episode_show_name,
        t.terratune_episode_uri, t.reason_start, t.reason_end, t.shuffle, t.skipped,
        t.offline, t.offline_timestamp, t.incognito_mode,
        a.name as artist_name, 
        al.title as album_title
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN albums al ON t.album_id = al.id
    `);
    
    const tracks = result.length > 0 ? result[0].values.map(track => ({
      id: track[0],
      title: track[1],
      artist_id: track[2],
      album_id: track[3],
      duration: track[4],
      file_url: track[5],
      created_at: track[6],
      ts: track[7],
      username: track[8],
      platform: track[9],
      ms_played: track[10],
      conn_country: track[11],
      ip_addr_decrypted: track[12],
      user_agent_decrypted: track[13],
      master_metadata_track_name: track[14],
      master_metadata_album_artist_name: track[15],
      master_metadata_album_album_name: track[16],
      terratune_track_uri: track[17],
      episode_name: track[18],
      episode_show_name: track[19],
      terratune_episode_uri: track[20],
      reason_start: track[21],
      reason_end: track[22],
      shuffle: Boolean(track[23]),
      skipped: Boolean(track[24]),
      offline: Boolean(track[25]),
      offline_timestamp: track[26],
      incognito_mode: Boolean(track[27]),
      artist_name: track[28],
      album_title: track[29]
    })) : [];
    
    console.log('[API /tracks] Fetched tracks:', JSON.stringify(tracks, null, 2));
    
    res.json(tracks);
  } catch (err) {
    console.error('[API /tracks] Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get track by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    
    const result = db.exec(`
      SELECT 
        t.id, t.title, t.artist_id, t.album_id, t.duration, t.file_url, t.created_at,
        t.ts, t.username, t.platform, t.ms_played, t.conn_country, t.ip_addr_decrypted,
        t.user_agent_decrypted, t.master_metadata_track_name, t.master_metadata_album_artist_name,
        t.master_metadata_album_album_name, t.terratune_track_uri, t.episode_name, t.episode_show_name,
        t.terratune_episode_uri, t.reason_start, t.reason_end, t.shuffle, t.skipped,
        t.offline, t.offline_timestamp, t.incognito_mode,
        a.name as artist_name, 
        al.title as album_title
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN albums al ON t.album_id = al.id
      WHERE t.id = ${id}
    `);
    
    if (result.length === 0 || !result[0].values || result[0].values.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }
    
    const trackData = result[0].values[0];
    const track = {
      id: trackData[0],
      title: trackData[1],
      artist_id: trackData[2],
      album_id: trackData[3],
      duration: trackData[4],
      file_url: trackData[5],
      created_at: trackData[6],
      ts: trackData[7],
      username: trackData[8],
      platform: trackData[9],
      ms_played: trackData[10],
      conn_country: trackData[11],
      ip_addr_decrypted: trackData[12],
      user_agent_decrypted: trackData[13],
      master_metadata_track_name: trackData[14],
      master_metadata_album_artist_name: trackData[15],
      master_metadata_album_album_name: trackData[16],
      terratune_track_uri: trackData[17],
      episode_name: trackData[18],
      episode_show_name: trackData[19],
      terratune_episode_uri: trackData[20],
      reason_start: trackData[21],
      reason_end: trackData[22],
      shuffle: Boolean(trackData[23]),
      skipped: Boolean(trackData[24]),
      offline: Boolean(trackData[25]),
      offline_timestamp: trackData[26],
      incognito_mode: Boolean(trackData[27]),
      artist_name: trackData[28],
      album_title: trackData[29]
    };
    
    console.log(`[API /tracks/:id] Fetched track ${id}:`, JSON.stringify(track, null, 2));
    res.json(track);
  } catch (err) {
    console.error(`[API /tracks/:id] Error fetching track ${id}:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 