import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
// Import components for displaying library items later
// import PlaylistCard from '../components/PlaylistCard';
// import ArtistCard from '../components/ArtistCard';
// import AlbumCard from '../components/AlbumCard';

const LibraryPage = () => {
  const { request, loading, error } = useApi();
  const { user } = useAuth(); // Get user info to fetch their library
  const [playlists, setPlaylists] = useState([]);
  // Add state for artists, albums later

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!user) return; // Don't fetch if user is not logged in

      try {
        // Fetch user's playlists
        const userPlaylists = await request(`/playlists/user/${user.id}`);
        setPlaylists(userPlaylists || []);
        
        // TODO: Fetch followed artists, saved albums etc.

      } catch (err) {
        console.error("Failed to fetch library data:", err);
      }
    };

    fetchLibrary();
  }, [request, user]);

  if (!user) {
    // Optional: Show message or redirect if user is not logged in
    return <div className="p-6"><p>Please log in to view your library.</p></div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>
      
      {loading && <p>Loading library...</p>}
      {error && <p className="text-red-500">Error loading library: {error}</p>}

      {!loading && !error && (
        <div className="library-content space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">Playlists</h2>
            {playlists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Replace with PlaylistCard component later */}
                {playlists.map(playlist => (
                  <div key={playlist.id} className="p-4 bg-gray-800 rounded">{playlist.title}</div>
                ))}
              </div>
            ) : (
              <p>You haven't created or saved any playlists yet.</p>
            )}
          </section>

          {/* TODO: Add sections for Artists, Albums, etc. */}
        </div>
      )}
    </div>
  );
};

export default LibraryPage; 