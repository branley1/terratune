import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

const TestApi = () => {
  const { request, loading, error } = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tracks = await request('/tracks');
        setData(tracks);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
      }
    };

    fetchData();
  }, [request]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Test Results</h2>
      {data && data.length > 0 ? (
        <div className="space-y-4">
          {data.map(track => (
            <div key={track.id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-medium">{track.title}</h3>
              <p className="text-sm text-gray-500">Artist: {track.artist_name}</p>
              <p className="text-sm text-gray-500">Album: {track.album_title}</p>
              <p className="text-sm text-gray-500">
                Duration: {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tracks found</p>
      )}
    </div>
  );
};

export default TestApi; 