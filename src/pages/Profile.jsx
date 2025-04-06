import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
// Import components like a UserEditForm later if needed

const ProfilePage = () => {
  const { user, logout } = useAuth(); // Get user info and logout function
  const { request, loading, error } = useApi();
  const [profileData, setProfileData] = useState(null); // For potentially more detailed data
  const [isEditing, setIsEditing] = useState(false); // State for edit mode

  // Fetch potentially more detailed profile data if needed
  useEffect(() => {
    if (!user) return;
    // Example: If you have a specific profile endpoint
    const fetchProfile = async () => {
      try {
        const data = await request(`/users/${user.id}`); 
        setProfileData(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    // fetchProfile(); 
    // For now, just use the basic user data from AuthContext
    setProfileData(user);
  }, [user, request]);

  if (!profileData) {
    // Can show loading state or handle user not logged in
    return <div className="p-6">Loading profile...</div>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // TODO: Implement profile update logic
  const handleUpdateProfile = async (formData) => {
    console.log("Updating profile with:", formData);
    // try {
    //   const updatedUser = await request(`/users/${user.id}`, {
    //     method: 'PUT',
    //     body: JSON.stringify(formData),
    //   });
    //   // Update AuthContext or refetch profile
    //   setIsEditing(false);
    // } catch (err) {
    //   console.error("Profile update failed:", err);
    // }
  };

  return (
    <div className="p-6">
      {/* Mimic structure from original static HTML */}
      <div className="profile-header mb-8 flex items-center gap-6">
        {/* Placeholder image */}
        <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-700 rounded-full shadow-lg flex-shrink-0 flex items-center justify-center text-4xl font-bold">
           {profileData.username ? profileData.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="details">
          <div className="profile-type text-sm font-bold text-gray-400 uppercase mb-1">Profile</div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-2">{profileData.username}</h1>
          <p className="text-gray-400">{profileData.email}</p>
          {/* Placeholder stats - fetch these later */} 
          {/* <div className="stats mt-2 text-sm text-gray-300">
            <span>0 Public Playlists</span>
            <span className="mx-2">&bull;</span>
            <span>0 Liked Songs</span>
            <span className="mx-2">&bull;</span>
            <span>Following 0 Artists</span>
          </div> */} 
        </div>
      </div>

      {/* Placeholder for user's content (e.g., public playlists) */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Public Playlists</h2>
        <p className="text-gray-500">No public playlists yet.</p>
      </div>

      <div className="flex gap-4">
         <button 
           onClick={handleEditToggle} 
           className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
         >
           {isEditing ? 'Cancel' : 'Edit Profile'}
         </button>
         <button 
           onClick={logout} 
           className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
         >
           Log Out
         </button>
      </div>

      {isEditing && (
        <div className="mt-6 p-4 border border-gray-700 rounded bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
          {/* Placeholder for an Edit Form component */}
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile({ /* form data */ }); }}>
             <div className="mb-3">
               <label className="block mb-1 text-sm text-gray-400">Username</label>
               <input type="text" defaultValue={profileData.username} className="w-full p-2 rounded bg-gray-700" />
             </div>
             <div className="mb-3">
               <label className="block mb-1 text-sm text-gray-400">Email</label>
               <input type="email" defaultValue={profileData.email} className="w-full p-2 rounded bg-gray-700" />
             </div>
             <button type="submit" className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500">Save Changes</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default ProfilePage; 