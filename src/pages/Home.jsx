import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi'; // Assuming useApi hook handles fetching
// We'll need components for PlaylistCard and SongCard later
// import PlaylistCard from '../components/PlaylistCard';
// import SongCard from '../components/SongCard'; 

const Home = () => {
  const { request, loading, error } = useApi();
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]); // Placeholder for playlist data

  useEffect(() => {
    // Fetch initial data for the home page (e.g., recent tracks, featured playlists)
    const fetchData = async () => {
      try {
        // Example: Fetching tracks like in TestApi
        const fetchedTracks = await request('/tracks'); 
        setTracks(fetchedTracks || []);

        // Placeholder: Fetch featured playlists (replace with actual endpoint later)
        // const fetchedPlaylists = await request('/playlists/featured');
        // setPlaylists(fetchedPlaylists || []);

      } catch (err) {
        console.error("Failed to fetch home page data:", err);
        // Error state is already handled by useApi hook
      }
    };

    fetchData();
  }, [request]);

  return (
    <section id="home-page">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
        </div>
        {/* Placeholder for Profile Button/Dropdown */}
        <div className="profile-button-container">
           <button className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-emerald-400 transition-colors" title="View Profile">
             W {/* Placeholder Initial */}
           </button>
           {/* Dropdown would be implemented here */}
         </div>
      </header>

      {/* Content Grid - We will replicate the original structure here */}
      <div className="content-grid grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Playlists/Soundscapes Section (Placeholder) */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold mb-4"><i className="fas fa-mountain mr-2"></i>Soundscapes (Placeholder)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Placeholder Cards - Replace with PlaylistCard component later */}
            <div className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition-colors">Playlist 1</div>
            <div className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition-colors">Playlist 2</div>
            <div className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition-colors">Playlist 3</div>
            <div className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition-colors">Playlist 4</div>
          </div>
        </div>

        {/* Queue Section (Placeholder - Can use TrackList or specific Queue component) */}
        <div className="queue-section lg:col-span-1">
          <h2 className="text-xl font-bold mb-4"><i className="fas fa-stream mr-2"></i>Queue / Recent Tracks</h2>
           {loading && <p>Loading tracks...</p>}
           {error && <p className="text-red-500">Error loading tracks: {error}</p>}
           <div className="space-y-2">
             {tracks.length > 0 ? (
               tracks.slice(0, 5).map(track => ( // Show first 5 tracks as example
                 <div key={track.id} className="flex items-center justify-between p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors cursor-pointer">
                   <div>
                     <h4 className="font-medium text-sm">{track.title}</h4>
                     <p className="text-xs text-gray-400">{track.artist_name}</p>
                   </div>
                   <span className="text-xs text-gray-400">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                   </span>
                 </div>
               ))
             ) : (
               !loading && <p className="text-gray-500 text-sm">No tracks found.</p>
             )}
           </div>
        </div>
      </div>
    </section>
  );
};

export default Home; 