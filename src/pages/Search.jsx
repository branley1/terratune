import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
// Import components for displaying results later
// import TrackList from '../components/TrackList';
// import ArtistCard from '../components/ArtistCard';
// import PlaylistCard from '../components/PlaylistCard';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ tracks: [], artists: [], playlists: [] });
  const { request, loading, error } = useApi();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const searchResults = await request(`/search?q=${encodeURIComponent(query)}`);
      setResults(searchResults || { tracks: [], artists: [], playlists: [] });
    } catch (err) {
      console.error("Search failed:", err);
      // Error is handled by useApi hook
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <input
          type="text"
          placeholder="Search for artists, songs, or playlists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </form>

      {loading && <p>Searching...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="search-results space-y-8">
          {results.tracks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Tracks</h2>
              {/* Replace with TrackList component later */}
              <div className="space-y-2">
                {results.tracks.map(track => (
                  <div key={track.id} className="p-2 bg-gray-800 rounded">{track.title} - {track.artist_name}</div>
                ))}
              </div>
            </section>
          )}
          
          {results.artists.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Artists</h2>
              {/* Replace with ArtistCard components later */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.artists.map(artist => (
                  <div key={artist.id} className="p-4 bg-gray-800 rounded">{artist.name}</div>
                ))}
              </div>
            </section>
          )}
          
          {results.playlists.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Playlists</h2>
              {/* Replace with PlaylistCard components later */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.playlists.map(playlist => (
                  <div key={playlist.id} className="p-4 bg-gray-800 rounded">{playlist.title}</div>
                ))}
              </div>
            </section>
          )}

          {/* Show message if no results and not loading/error */}
          {!loading && !error && results.tracks.length === 0 && results.artists.length === 0 && results.playlists.length === 0 && query && (
            <p>No results found for "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage; 