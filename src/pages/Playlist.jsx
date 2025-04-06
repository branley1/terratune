import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get playlist ID from URL
import { useApi } from '../hooks/useApi';
// Import TrackList or similar component later

const PlaylistPage = () => {
  const { playlistId } = useParams(); // Get the ID from the route parameter
  const { request, loading, error } = useApi();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId) return;
      try {
        const data = await request(`/playlists/${playlistId}`);
        setPlaylist(data);
      } catch (err) {
        console.error(`Failed to fetch playlist ${playlistId}:`, err);
      }
    };
    fetchPlaylist();
  }, [request, playlistId]);

  return (
    <div className="p-6">
      {loading && <p>Loading playlist...</p>}
      {error && <p className="text-red-500">Error loading playlist: {error}</p>}
      
      {playlist && (
        <> 
          {/* Header Section */}
          <div className="playlist-header mb-8 flex items-end gap-6">
            {/* Placeholder for playlist cover image */}
            <div className="w-48 h-48 bg-gray-700 rounded shadow-lg flex-shrink-0"></div>
            <div>
              <p className="text-sm font-bold">Playlist</p>
              <h1 className="text-4xl lg:text-6xl font-bold mb-2">{playlist.title}</h1>
              <p className="text-gray-400 mb-2">{playlist.description}</p>
              <p className="text-sm text-gray-300">Created by: {playlist.creator_name || 'User'} &bull; {playlist.tracks.length} songs</p>
            </div>
          </div>

          {/* Actions Bar (Play button, etc.) - Placeholder */}
          <div className="actions mb-6">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-full w-14 h-14 flex items-center justify-center">
              <i className="fas fa-play text-xl"></i>
            </button>
          </div>

          {/* Track List */}
          <div className="track-list">
             {/* Replace with TrackList component later */}
             <div className="space-y-2">
               {playlist.tracks.length > 0 ? (
                 playlist.tracks.map((track, index) => (
                   <div key={track.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded hover:bg-gray-700/50">
                     <div className="flex items-center gap-4">
                       <span className="text-gray-400 w-4 text-right">{index + 1}</span>
                       {/* Placeholder for track image? */}
                       <div>
                         <h4 className="font-medium text-sm text-white">{track.title}</h4>
                         {/* Link to artist page later */}
                         <p className="text-xs text-gray-400">{track.artist_name || 'Unknown Artist'}</p> 
                       </div>
                     </div>
                     <span className="text-xs text-gray-400">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                     </span>
                   </div>
                 ))
               ) : (
                 <p className="text-gray-500">This playlist is empty.</p>
               )}
             </div>
          </div>
        </>
      )}
      {!loading && !error && !playlist && (
        <p>Playlist not found.</p>
      )}
    </div>
  );
};

export default PlaylistPage; 