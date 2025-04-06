import { execQuery } from './index.js';

// Sample data
const sampleData = [
  {
    "ts": "2021-08-31T03:56:45Z",
    "platform": "web_player chrome undefined;chrome 92.0.4515.162;desktop",
    "ms_played": 2452,
    "conn_country": "US",
    "ip_addr_decrypted": "130.58.99.205", // Renamed ip_addr to ip_addr_decrypted for consistency
    "user_agent_decrypted": null, // Add if available
    "master_metadata_track_name": "IYO (feat. Focalistic, Mapara A Jazz, & Ntosh Gazi)",
    "master_metadata_album_artist_name": "Diamond Platnumz",
    "master_metadata_album_album_name": "IYO (feat. Focalistic, Mapara A Jazz, & Ntosh Gazi)",
    "terratune_track_uri": "terratune:track:4CqIW0SZapPpI0IQq6Yno0",
    "episode_name": null,
    "episode_show_name": null,
    "terratune_episode_uri": null,
    "reason_start": "remote",
    "reason_end": "endplay",
    "shuffle": false,
    "skipped": false,
    "offline": false,
    "offline_timestamp": null,
    "incognito_mode": false,
    "username": null // Add username if available
  },
  {
    "ts": "2021-08-31T03:59:46Z",
    "platform": "web_player chrome undefined;chrome 92.0.4515.162;desktop",
    "ms_played": 180002,
    "conn_country": "US",
    "ip_addr_decrypted": "130.58.99.205",
    "user_agent_decrypted": null,
    "master_metadata_track_name": "Confession",
    "master_metadata_album_artist_name": "Omah Lay",
    "master_metadata_album_album_name": "What Have We Done",
    "terratune_track_uri": "terratune:track:2yIUb32c5s0cjMFuQJKTy7",
    "episode_name": null,
    "episode_show_name": null,
    "terratune_episode_uri": null,
    "reason_start": "clickrow",
    "reason_end": "trackdone",
    "shuffle": false,
    "skipped": false,
    "offline": false,
    "offline_timestamp": null,
    "incognito_mode": false,
    "username": null
  },
  {
    "ts": "2021-08-31T04:00:33Z",
    "platform": "web_player chrome undefined;chrome 92.0.4515.162;desktop",
    "ms_played": 46528,
    "conn_country": "US",
    "ip_addr_decrypted": "130.58.99.205",
    "user_agent_decrypted": null,
    "master_metadata_track_name": "Too Correct",
    "master_metadata_album_artist_name": "Crayon",
    "master_metadata_album_album_name": "Twelve A.M",
    "terratune_track_uri": "terratune:track:3jZ6HPh1hWZJCuKJKS6Ey0",
    "episode_name": null,
    "episode_show_name": null,
    "terratune_episode_uri": null,
    "reason_start": "trackdone",
    "reason_end": "endplay",
    "shuffle": false,
    "skipped": false,
    "offline": false,
    "offline_timestamp": null,
    "incognito_mode": false,
    "username": null
  },
   {
    "ts": "2021-08-31T04:00:48Z",
    "platform": "web_player chrome undefined;chrome 92.0.4515.162;desktop",
    "ms_played": 14151,
    "conn_country": "US",
    "ip_addr_decrypted": "130.58.99.205",
    "user_agent_decrypted": null,
    "master_metadata_track_name": "Memory",
    "master_metadata_album_artist_name": "Kane Brown",
    "master_metadata_album_album_name": "Memory",
    "terratune_track_uri": "terratune:track:34chhNX59Wo9HMFCsI3K8Y",
    "episode_name": null,
    "episode_show_name": null,
    "terratune_episode_uri": null,
    "reason_start": "playbtn",
    "reason_end": "endplay",
    "shuffle": false,
    "skipped": false,
    "offline": false,
    "offline_timestamp": null,
    "incognito_mode": false,
    "username": null
  },
  {
    "ts": "2021-08-31T04:04:19Z",
    "platform": "web_player chrome undefined;chrome 92.0.4515.162;desktop",
    "ms_played": 210899,
    "conn_country": "US",
    "ip_addr_decrypted": "130.58.99.205",
    "user_agent_decrypted": null,
    "master_metadata_track_name": "Saturday Nights REMIX",
    "master_metadata_album_artist_name": "Khalid",
    "master_metadata_album_album_name": "Saturday Nights REMIX",
    "terratune_track_uri": "terratune:track:0W5oXFrxZNBTIS1eMW9Ofz",
    "episode_name": null,
    "episode_show_name": null,
    "terratune_episode_uri": null,
    "reason_start": "clickrow",
    "reason_end": "trackdone",
    "shuffle": false,
    "skipped": false,
    "offline": false,
    "offline_timestamp": null,
    "incognito_mode": false,
    "username": null
  },
    {
    "ts": "2021-08-31T04:07:13Z",
    "platform": "web_player chrome undefined;chrome 92.0.4515.162;desktop",
    "ms_played": 173739,
    "conn_country": "US",
    "ip_addr_decrypted": "130.58.99.205",
    "user_agent_decrypted": null,
    "master_metadata_track_name": "Eastside (with Halsey & Khalid)",
    "master_metadata_album_artist_name": "benny blanco",
    "master_metadata_album_album_name": "Eastside (with Halsey & Khalid)",
    "terratune_track_uri": "terratune:track:0d2iYfpKoM0QCKvcLCkBao",
    "episode_name": null,
    "episode_show_name": null,
    "terratune_episode_uri": null,
    "reason_start": "trackdone",
    "reason_end": "trackdone",
    "shuffle": false,
    "skipped": false,
    "offline": false,
    "offline_timestamp": null,
    "incognito_mode": false,
    "username": null
  },
  {
    "ts": "2021-08-31T04:10:58Z",
    "platform": "web_player chrome undefined;chrome 92.0.4515.162;desktop",
    "ms_played": 224304,
    "conn_country": "US",
    "ip_addr_decrypted": "130.58.99.205",
    "user_agent_decrypted": null,
    "master_metadata_track_name": "OTW - BURNS Version",
    "master_metadata_album_artist_name": "Khalid",
    "master_metadata_album_album_name": "OTW",
    "terratune_track_uri": "terratune:track:1sV3BBYDKQYJyYoTidUWR7",
    "episode_name": null,
    "episode_show_name": null,
    "terratune_episode_uri": null,
    "reason_start": "trackdone",
    "reason_end": "endplay",
    "shuffle": false,
    "skipped": false,
    "offline": false,
    "offline_timestamp": null,
    "incognito_mode": false,
    "username": null
  },
  {
    "ts": "2021-08-31T04:12:23Z",
    "platform": "web_player chrome undefined;chrome 92.0.4515.162;desktop",
    "ms_played": 83776,
    "conn_country": "US",
    "ip_addr_decrypted": "130.58.99.205",
    "user_agent_decrypted": null,
    "master_metadata_track_name": "Bad",
    "master_metadata_album_artist_name": "Blaiz Fayah",
    "master_metadata_album_album_name": "Bad",
    "terratune_track_uri": "terratune:track:2WrxGpnCvpwiQkcHDDmVXc",
    "episode_name": null,
    "episode_show_name": null,
    "terratune_episode_uri": null,
    "reason_start": "clickrow",
    "reason_end": "endplay",
    "shuffle": false,
    "skipped": false,
    "offline": false,
    "offline_timestamp": null,
    "incognito_mode": false,
    "username": null
  }
];

// Helper to get or insert artist/album and return ID
const getOrInsertArtist = (db, name) => {
  if (!name) return null;
  const result = db.exec(`SELECT id FROM artists WHERE name = '${name}'`);
  if (result.length > 0 && result[0].values && result[0].values.length > 0) {
    return result[0].values[0][0]; // Return existing ID
  } else {
    db.exec(`INSERT INTO artists (name) VALUES ('${name}')`);
    return db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
  }
};

const getOrInsertAlbum = (db, title, artistId) => {
  if (!title) return null;
  const result = db.exec(`SELECT id FROM albums WHERE title = '${title}' AND artist_id = ${artistId}`);
  if (result.length > 0 && result[0].values && result[0].values.length > 0) {
    return result[0].values[0][0]; // Return existing ID
  } else {
    db.exec(`INSERT INTO albums (title, artist_id) VALUES ('${title}', ${artistId})`);
    return db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
  }
};

export const seedDatabase = (db) => {

  // Check if tracks table already has data from this seed
  const trackCountResult = db.exec(`SELECT COUNT(*) FROM tracks WHERE terratune_track_uri LIKE 'terratune:track:%'`);
  const trackCount = trackCountResult.length > 0 && trackCountResult[0].values ? trackCountResult[0].values[0][0] : 0;

  if (trackCount > 0) {
    console.log('[Seed] Database already contains sample track data. Skipping seeding.');
    return;
  }

  console.log('[Seed] Seeding database with sample track data...');

  sampleData.forEach(item => {
    try {
      const artistId = getOrInsertArtist(db, item.master_metadata_album_artist_name);
      const albumId = getOrInsertAlbum(db, item.master_metadata_album_album_name, artistId);

      db.exec(`
        INSERT INTO tracks (
          title, artist_id, album_id, duration, file_url,
          ts, username, platform, ms_played, conn_country, ip_addr_decrypted,
          user_agent_decrypted, master_metadata_track_name, master_metadata_album_artist_name,
          master_metadata_album_album_name, terratune_track_uri, episode_name, episode_show_name,
          terratune_episode_uri, reason_start, reason_end, shuffle, skipped,
          offline, offline_timestamp, incognito_mode
        ) VALUES (
          '${item.master_metadata_track_name || 'Unknown Track'}',
          ${artistId || 'NULL'},
          ${albumId || 'NULL'},
          ${Math.round((item.ms_played || 0) / 1000)},
          '/tracks/${item.terratune_track_uri?.split(':').pop() || 'default'}.mp3',
          '${item.ts || ''}',
          ${item.username ? `'${item.username}'` : 'NULL'},
          '${item.platform || ''}',
          ${item.ms_played || 0},
          '${item.conn_country || ''}',
          '${item.ip_addr_decrypted || ''}',
          ${item.user_agent_decrypted ? `'${item.user_agent_decrypted}'` : 'NULL'},
          '${item.master_metadata_track_name || ''}',
          '${item.master_metadata_album_artist_name || ''}',
          '${item.master_metadata_album_album_name || ''}',
          '${item.terratune_track_uri || ''}',
          ${item.episode_name ? `'${item.episode_name}'` : 'NULL'},
          ${item.episode_show_name ? `'${item.episode_show_name}'` : 'NULL'},
          ${item.terratune_episode_uri ? `'${item.terratune_episode_uri}'` : 'NULL'},
          '${item.reason_start || ''}',
          '${item.reason_end || ''}',
          ${item.shuffle ? 1 : 0},
          ${item.skipped ? 1 : 0},
          ${item.offline ? 1 : 0},
          ${item.offline_timestamp ? `'${item.offline_timestamp}'` : 'NULL'},
          ${item.incognito_mode ? 1 : 0}
        )
      `);
    } catch (error) {
      console.error(`[Seed] Error inserting track ${item.terratune_track_uri}:`, error);
      // Decide if you want to stop seeding on error or continue
    }
  });

  console.log('[Seed] Finished seeding sample data.');
}; 