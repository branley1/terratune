import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import ProfileEditForm from '../components/ProfileEditForm';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { request, loading, error } = useApi();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfileData(user);
  }, [user]);

  if (!profileData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-white/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateSuccess = async (updatedUser) => {
    try {
      // Update the user data in the backend
      const response = await request(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
      });

      // Update the user data in the auth context and local state
      updateUser(response);
      setProfileData(response);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // Get display name (name or username)
  const displayName = profileData.name || profileData.username || 'User';

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt={displayName}
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <div className="text-sm font-bold text-white/70 uppercase mb-1">Profile</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{displayName}</h1>
              <p className="text-white/70">{profileData.email}</p>
              {profileData.bio && (
                <p className="mt-4 text-white/70">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button
            onClick={() => window.location.href = '/logout'}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <ProfileEditForm
            user={profileData}
            onCancel={handleEditToggle}
            onSuccess={handleUpdateSuccess}
          />
        )}

        {/* Public Playlists Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Public Playlists</h2>
          <p className="text-white/70">No public playlists yet.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 