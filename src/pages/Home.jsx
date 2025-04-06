import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Queue from '../components/Queue';
import TrackCard from '../components/TrackCard';

const Home = () => {
  const { request, loading, error } = useApi();
  const { user } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // Fetch initial data for the home page
    const fetchData = async () => {
      try {
        // Example: Fetching tracks
        const fetchedTracks = await request('/tracks'); 
        setTracks(fetchedTracks || []);

        // Future implementation: Fetch playlists
        // const fetchedPlaylists = await request('/playlists/featured');
        // setPlaylists(fetchedPlaylists || []);

      } catch (err) {
        console.error("Failed to fetch home page data:", err);
      }
    };

    fetchData();
  }, [request]);

  // Simulate playlist data for now, alternating cover images
  const placeholderPlaylists = [
    { id: 1, title: 'Forest Ambience', artist: 'TerraTune', cover_url: '/placeholder-1.jpg' },
    { id: 2, title: 'Mountain Winds', artist: 'Nature\'s Echo', cover_url: '/placeholder-2.jpg' },
    { id: 3, title: 'Gentle Rain', artist: 'Serene Sounds', cover_url: '/placeholder-1.jpg' }, // Alternated
    { id: 4, title: 'Ocean Waves', artist: 'TerraTune', cover_url: '/placeholder-2.jpg' }, // Alternated
    // Add more examples if needed, continue alternating
    // { id: 5, title: 'Desert Night', artist: 'Echoes', cover_url: '/placeholder-1.jpg' },
  ];

  // Calculate display name and initial
  const displayName = user?.name || user?.username || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <section className="px-2 py-4">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome Back, {displayName}!</h2>
          <p className="text-white/70 mt-1">Discover natural sounds for your day</p>
        </div>
        
        {/* Profile Button as Link */}
        <Link 
          to="/profile" 
          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black font-bold text-sm hover:bg-accent/90 transition-colors flex-shrink-0"
          title="View Profile"
        >
          {userInitial}
        </Link>
      </header>

      {/* Content Grid */}
      <div className="content-grid grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Soundscapes Section */}
        <div className="lg:col-span-3">
          <h2 className="section-title text-xl font-bold mb-4 flex items-center">
            <i className="fas fa-leaf text-accent mr-2"></i>
            Soundscapes
          </h2>
          <div className="card-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {placeholderPlaylists.map(playlist => (
              <TrackCard 
                key={playlist.id} 
                track={{ 
                  id: playlist.id, 
                  title: playlist.title, 
                  artist: { name: playlist.artist },
                  album: { cover_url: playlist.cover_url }
                }} 
              />
            ))}
          </div>

          {/* Recent Tracks Section */}
          <h2 className="section-title text-xl font-bold mt-8 mb-4 flex items-center">
            <i className="fas fa-music text-accent mr-2"></i>
            Recent Tracks
          </h2>
          <div className="card-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tracks.slice(0, 8).map(track => (
              <TrackCard key={track.id} track={track} />
            ))}
            {loading && <div className="col-span-full text-center py-10"><i className="fas fa-spinner fa-spin text-accent text-2xl"></i></div>}
            {error && <div className="col-span-full text-center py-10 text-red-500">Error loading tracks</div>}
          </div>
        </div>

        {/* Queue Section - Now using the Queue component */}
        <div className="lg:col-span-1">
          <Queue />
        </div>
      </div>
    </section>
  );
};

export default Home; 