// Simple script to toggle play/pause button
document.addEventListener('DOMContentLoaded', function() {
    // ==========
    // State Variables
    // ==========
    let isPlaying = true;       // Tracks if audio is currently playing or paused
    let currentVolume = 0.7;    // Current volume level (0.0 to 1.0)
    let isMuted = false;        // Tracks if volume is muted
    let currentView = 'home-page'; // ID of the currently visible main content section
    // Add state for remembering the last non-content view page if needed
    // let previousView = 'home-page'; 

    // Add new state variables
    let currentArtist = null;
    let currentAlbum = null;

    // ==========
    // Element Selectors
    // ==========
    const body = document.body;
    // const appContainer = document.querySelector('.app-container'); // Unused currently
    const sidebar = document.querySelector('.sidebar');
    const mainArea = document.querySelector('.main-area');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContent = mainArea?.querySelector('.main-content');

    // --- Player Bar Elements ---
    const playerBar = mainArea?.querySelector('.player-bar');
    const playerPlayPauseButton = playerBar?.querySelector('.play-pause-main');
    const playerPlayPauseIcon = playerPlayPauseButton?.querySelector('i');
    const progressBar = playerBar?.querySelector('.progress-bar');
    const progressFill = playerBar?.querySelector('.progress-fill');
    const currentTimeEl = playerBar?.querySelector('.current-time');
    const totalTimeEl = playerBar?.querySelector('.total-time');
    const volumeSlider = playerBar?.querySelector('.volume-slider');
    const volumeIconButton = playerBar?.querySelector('.volume-icon-button');
    const volumeIcon = volumeIconButton?.querySelector('i');
    const songInfoContainer = playerBar?.querySelector('.song-info');
    // const songInfoImage = songInfoContainer?.querySelector('img'); // Unused currently
    const songInfoTitle = songInfoContainer?.querySelector('.text h4');
    const songInfoArtist = songInfoContainer?.querySelector('.text p');

    // --- Sidebar Navigation Elements ---
    const navLinks = sidebar?.querySelectorAll('.nav-link');
    const playlistLinks = sidebar?.querySelectorAll('.playlists ul a');
    const likedSongsLink = sidebar?.querySelector('.playlists > a[href="#liked"]');

    // --- Main Content Elements ---
    const pageSections = mainContent?.querySelectorAll(':scope > section');
    const profileLinkIcon = mainContent?.querySelector('.profile-link');

    // --- Content View Page Elements ---
    const contentViewPage = document.getElementById('content-view-page');
    const contentViewTitle = document.getElementById('content-title');
    const contentViewDetails = document.getElementById('content-details');
    const backButton = document.getElementById('back-button');

    // --- Now Playing Page Elements ---
    const nowPlayingPage = document.getElementById('now-playing-page');
    const minimizePlayerButton = document.getElementById('minimize-player-button');
    const npAlbumArt = document.getElementById('np-album-art');
    const npTitle = document.getElementById('np-title');
    const npArtist = document.getElementById('np-artist');
    // Note: Progress bar/buttons inside now playing page might need separate selectors if they differ from player bar
    const npProgressBar = nowPlayingPage?.querySelector('.progress-bar');
    const npProgressFill = npProgressBar?.querySelector('.progress-fill');
    const npCurrentTime = nowPlayingPage?.querySelector('.current-time');
    const npTotalTime = nowPlayingPage?.querySelector('.total-time');
    const npPlayPauseButton = nowPlayingPage?.querySelector('.play-pause-main');
    const npPlayPauseIcon = npPlayPauseButton?.querySelector('i');

    // --- Profile Dropdown ---
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');

    // Chat Data
    const chatMessages = [
        {
            sender: "TerraTune",
            message: "Welcome to TerraTune! 🌿 Discover the sounds of nature.",
            timestamp: "10:00 AM"
        },
        {
            sender: "User",
            message: "I love the new Mountain Stream track! So peaceful.",
            timestamp: "10:05 AM"
        },
        {
            sender: "TerraTune",
            message: "We're glad you're enjoying it! 🏔️ You might also like 'Alpine Meadow' from the same album.",
            timestamp: "10:06 AM"
        },
        {
            sender: "User",
            message: "Thanks! Can you recommend more tracks like that?",
            timestamp: "10:10 AM"
        },
        {
            sender: "TerraTune",
            message: "Here are some similar tracks:\n• Forest Rain by Woodland Whispers\n• Crystal Lake Meditation\n• Valley Winds Ambient\n• Dawn Chorus by Nature's Harmony",
            timestamp: "10:12 AM"
        },
        {
            sender: "User",
            message: "Perfect! Adding these to my Nature Trail playlist.",
            timestamp: "10:15 AM"
        },
        {
            sender: "TerraTune",
            message: "🌲 Great choice! Your Nature Trail playlist is growing beautifully. Don't forget to check out our weekly curated 'Morning Dew' playlist for fresh ambient tracks.",
            timestamp: "10:16 AM"
        }
    ];

    // ==========
    // Core Functions
    // ==========

    /**
     * Updates the play/pause button icon based on the isPlaying state.
     * Handles both the player bar and the fullscreen player icons.
     */
    function updatePlayerUI() {
        // Player bar icon
        if (playerPlayPauseIcon) {
            playerPlayPauseIcon.classList.toggle('fa-pause', isPlaying);
            playerPlayPauseIcon.classList.toggle('fa-play', !isPlaying);
        }
        // Fullscreen player icon
         if (npPlayPauseIcon) {
            npPlayPauseIcon.classList.toggle('fa-pause', isPlaying);
            npPlayPauseIcon.classList.toggle('fa-play', !isPlaying);
        }
        // Note: Actual audio playback control is handled separately
    }

    /**
     * Updates the volume slider and icon based on currentVolume and isMuted state.
     */
    function updateVolumeUI() {
         if (!volumeSlider || !volumeIcon) return;
         const displayVolume = isMuted ? 0 : currentVolume;
         volumeSlider.value = displayVolume * 100;
         volumeIcon.classList.remove('fa-volume-mute', 'fa-volume-down', 'fa-volume-up');
         if (displayVolume === 0) volumeIcon.classList.add('fa-volume-mute');
         else if (displayVolume < 0.5) volumeIcon.classList.add('fa-volume-down');
         else volumeIcon.classList.add('fa-volume-up');
    }

    /**
     * Toggles the playback state (playing/paused) and updates the UI.
     */
    function togglePlayPause() {
        isPlaying = !isPlaying;
        updatePlayerUI();
        console.log(isPlaying ? "Audio Playing" : "Audio Paused"); 
    }

    /**
     * Toggles the mute state and updates the volume UI.
     */
    function toggleMute() {
        isMuted = !isMuted;
        updateVolumeUI();
        console.log(`Muted: ${isMuted}`);
    }

    /**
     * Handles changes from the volume slider input.
     * @param {Event} event - The input event object.
     */
    function handleVolumeChange(event) {
        currentVolume = parseFloat(event.target.value) / 100;
        isMuted = currentVolume === 0;
        updateVolumeUI();
         console.log(`Volume set to ${currentVolume * 100}%`);
    }

     /**
     * Updates the progress bar and time display for both player bar and fullscreen view.
     * @param {number} percentage - The playback progress percentage (0 to 1).
     * @param {number} totalSeconds - The total duration of the track in seconds.
     */
    function updateProgressDisplay(percentage, totalSeconds) {
         const currentSeconds = Math.floor(totalSeconds * percentage);
         const minutes = Math.floor(currentSeconds / 60);
         const seconds = currentSeconds % 60;
         const currentTimeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

         // Update player bar
         if (progressFill) progressFill.style.width = percentage * 100 + '%';
         if (currentTimeEl) currentTimeEl.textContent = currentTimeString;

         // Update fullscreen player (if elements exist)
         if (npProgressFill) npProgressFill.style.width = percentage * 100 + '%';
         if (npCurrentTime) npCurrentTime.textContent = currentTimeString;
    }

    /**
     * Handles clicks on the progress bar (player bar or fullscreen) to seek the track.
     * @param {MouseEvent} event - The click event object.
     * @param {HTMLElement} progressBarElement - The specific progress bar element clicked.
     */
    function handleProgressClick(event, progressBarElement) {
        if (!progressBarElement || !totalTimeEl) return;

        const progressBarRect = progressBarElement.getBoundingClientRect();
        const clickPositionX = event.clientX - progressBarRect.left;
        const progressBarWidth = progressBarRect.width;
        let percentage = Math.max(0, Math.min(1, clickPositionX / progressBarWidth));
        
        // --- Get Total Duration (Replace with actual audio duration logic) --- 
        const durationText = totalTimeEl.textContent; // Assumes player bar total time is reliable
        const timeParts = durationText.split(':').map(Number);
        let totalSeconds = 296; // Default duration
        if (timeParts.length === 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
            totalSeconds = (timeParts[0] * 60) + timeParts[1];
        }
        // ---

        updateProgressDisplay(percentage, totalSeconds); // Update UI immediately
        
        // TODO: Add actual audio seek call here (pass percentage or calculated time)
        console.log(`Seek to ${(percentage * 100).toFixed(1)}%`);
    }

    /**
     * Creates a single falling leaf element with random properties and adds it to the body.
     */
    function createFallingLeaf() {
        const leaf = document.createElement('div');
        leaf.innerHTML = '<i class="fas fa-leaf"></i>';
        leaf.className = 'falling-leaf';
        const variant = Math.floor(Math.random() * 5);
        leaf.classList.add(`variant-${variant}`);
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.animationDelay = Math.random() * 10 + 's'; 
        leaf.style.animationDuration = 6 + Math.random() * 10 + 's';
        leaf.style.fontSize = 12 + Math.random() * 12 + 'px';
        body.appendChild(leaf);
        leaf.addEventListener('animationend', () => leaf.remove());
    }

    /**
     * Shows the specified page section and hides others, managing visibility states.
     * @param {string} targetId - The ID of the page section to show (e.g., 'home-page', 'now-playing-page').
     */
    function showPage(targetId) {
        if (!mainContent) {
             console.error("Main content area not found.");
             return;
        }

        // Special handling for fullscreen player
        if (targetId === 'now-playing-page') {
            body.classList.add('now-playing-visible');
            // Optionally update fullscreen player content here if needed
        } else {
            body.classList.remove('now-playing-visible');
            // Hide all main content sections first
            pageSections?.forEach(section => {
                section.classList.add('hidden');
            });
            // Show the target section if it exists
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                currentView = targetId;
            } else {
                // Fallback to home page if target not found
                console.warn(`Target page section not found: ${targetId}. Showing home page.`);
                document.getElementById('home-page')?.classList.remove('hidden');
                currentView = 'home-page';
            }
            // Update sidebar active links only for main views
             updateSidebarActiveState();
            // Scroll main content to top
            mainContent.scrollTo(0, 0);
        }
         console.log(`Showing page: ${currentView}`);
    }

    /**
     * Updates the active link styling in the sidebar based on the currentView.
     */
     function updateSidebarActiveState() {
         const activeHref = `#${currentView.replace('-page', '')}`;
         navLinks?.forEach(link => {
             link.classList.toggle('active', link.getAttribute('href') === activeHref);
         });
          playlistLinks?.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === activeHref);
          });
          likedSongsLink?.classList.toggle('active', activeHref === '#liked');
          // Clear active state if viewing content details or now playing
          if (currentView === 'content-view-page' || currentView === 'now-playing-page') {
              navLinks?.forEach(link => link.classList.remove('active'));
              playlistLinks?.forEach(link => link.classList.remove('active'));
              likedSongsLink?.classList.remove('active');
          }
     }

    /**
     * Toggles the visibility of the sidebar by adding/removing a class on the body.
     */
    function toggleSidebar() {
        body.classList.toggle('sidebar-visible');
    }

    /**
     * Displays placeholder details for a clicked item (playlist, artist, album).
     * @param {string} type - The type of content (e.g., 'playlist', 'artist').
     * @param {string} id - The unique identifier for the content.
     * @param {string} [title='Details'] - The title to display for the content.
     */
    function showContentView(type, id, title = 'Details') {
        if (!contentViewPage || !contentViewTitle || !contentViewDetails) {
            console.error("Content view elements not found.");
            return;
        }
         // Don't show content view for 'song' or 'now-playing' clicks here
         if (type === 'song' || type === 'now-playing') {
             console.log(`Ignoring content view request for type: ${type}`);
             return; 
         }

        console.log(`Show content view for ${type}: ${id}`);
        currentView = 'content-view-page'; // Set tracker before showing page
        showPage(currentView); // Use showPage to handle hiding/showing

        contentViewTitle.textContent = title;
        contentViewDetails.innerHTML = `
            <p class="text-gray-400 mb-4">Displaying placeholder content for:</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>ID:</strong> ${id}</p>
            <p class="mt-4"><em>(Replace this with actual fetched data and layout for the ${type})</em></p>
            ${type === 'playlist' || type === 'album' ? '<button class="mt-6 bg-emerald-500 px-5 py-2 rounded-full font-bold hover:bg-emerald-400 transition duration-200">Play All</button>' : ''}
         `;
         updateSidebarActiveState(); // Ensure sidebar links are inactive
    }

    // --- Player Bar Song Info Click Handlers ---
    const songTitle = playerBar?.querySelector('.song-info .text h4');
    const artistName = playerBar?.querySelector('.song-info .text p');

    songTitle?.addEventListener('click', () => {
        showNowPlayingView();
    });

    artistName?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent triggering the parent click handler
        const artistId = artistName.dataset.id;
        if (artistId) {
            showArtistPage(artistId);
        }
    });

    // Update showNowPlayingView to handle player bar visibility
    function showNowPlayingView() {
        // Get current song info from the player bar
        const currentTitle = songTitle?.textContent || "Mountain Stream";
        const currentArtist = artistName?.textContent || "Nature's Harmony";
        const currentArt = playerBar?.querySelector('.song-info img')?.src || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';

        // Update the full-screen view elements
        if (npTitle) npTitle.textContent = currentTitle;
        if (npArtist) npArtist.textContent = currentArtist;
        if (npAlbumArt) {
            npAlbumArt.src = currentArt;
            // Preload the high-res image
            const img = new Image();
            img.src = currentArt;
            img.onload = () => {
                npAlbumArt.src = currentArt;
                npAlbumArt.style.opacity = '1';
            };
        }

        // Show the full-screen view and hide player bar
        const nowPlayingPage = document.getElementById('now-playing-page');
        if (nowPlayingPage) {
            nowPlayingPage.classList.remove('hidden');
            body.classList.add('now-playing-visible');
            playerBar?.classList.add('hidden');
        }

        // Sync the progress and time with the player bar
        syncPlayerProgress();
    }

    function hideNowPlayingView() {
        const nowPlayingPage = document.getElementById('now-playing-page');
        if (nowPlayingPage) {
            nowPlayingPage.classList.add('hidden');
            body.classList.remove('now-playing-visible');
            playerBar?.classList.remove('hidden');
        }
    }

    function syncPlayerProgress() {
        const playerProgress = playerBar?.querySelector('.progress-fill');
        const npProgress = nowPlayingPage?.querySelector('.progress-fill');
        if (playerProgress && npProgress) {
            npProgress.style.width = playerProgress.style.width;
        }

        const playerCurrentTime = playerBar?.querySelector('.current-time');
        const npCurrentTime = nowPlayingPage?.querySelector('.current-time');
        if (playerCurrentTime && npCurrentTime) {
            npCurrentTime.textContent = playerCurrentTime.textContent;
        }

        const playerTotalTime = playerBar?.querySelector('.total-time');
        const npTotalTime = nowPlayingPage?.querySelector('.total-time');
        if (playerTotalTime && npTotalTime) {
            npTotalTime.textContent = playerTotalTime.textContent;
        }

        // Update play/pause button state
        const npPlayPauseIcon = nowPlayingPage?.querySelector('.play-pause-main i');
        if (npPlayPauseIcon) {
            npPlayPauseIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    /**
     * Navigates back from the content view page (currently defaults to home).
     */
    function goBack() {
        // TODO: Implement more robust back navigation 
        let previousPage = 'home-page'; 
        showPage(previousPage);
    }

    /**
     * Shows the artist page with the specified artist data.
     * @param {string} artistId - The ID of the artist to display.
     */
    function showArtistPage(artistId) {
        // Example artist data (themed around nature/ambient music)
        const artistData = {
            name: 'Nature\'s Harmony',
            description: 'Ambient soundscape artist capturing the essence of natural environments.',
            featuredImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            monthlyListeners: '156,234',
            topTracks: [
                { id: 1, title: 'Mountain Stream', album: 'Alpine Serenity', plays: '1.2M', duration: '3:15', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=40&q=80' },
                { id: 2, title: 'Forest Rain', album: 'Woodland Whispers', plays: '982K', duration: '4:20', image: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=40&q=80' },
                { id: 3, title: 'Dawn Chorus', album: 'Morning Meditations', plays: '870K', duration: '5:30', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=40&q=80' },
                { id: 4, title: 'Ocean Waves', album: 'Coastal Dreams', plays: '732K', duration: '6:45', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=40&q=80' },
                { id: 5, title: 'Desert Wind', album: 'Dune Meditation', plays: '654K', duration: '4:15', image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=40&q=80' }
            ],
            popularAlbums: [
                { title: 'Alpine Serenity', tracks: 8, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' },
                { title: 'Woodland Whispers', tracks: 6, image: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' },
                { title: 'Morning Meditations', tracks: 7, image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' }
            ]
        };

        const artistPage = document.getElementById('artist-page');
        if (!artistPage) return;

        // Update artist page content
        artistPage.innerHTML = `
            <div class="artist-banner" style="background-image: url('${artistData.featuredImage}')">
                <div class="artist-info">
                    <h1>${artistData.name}</h1>
                    <p class="artist-description">${artistData.description}</p>
                    <p class="monthly-listeners">${artistData.monthlyListeners} monthly listeners</p>
                </div>
            </div>

            <div class="artist-content">
                <section class="top-tracks">
                    <h2>Popular Tracks</h2>
                    <div class="tracks-list">
                        ${artistData.topTracks.map((track, index) => `
                            <div class="track-item">
                                <span class="track-number">${index + 1}</span>
                                <img src="${track.image}" alt="${track.title}">
                                <div class="track-info">
                                    <h3>${track.title}</h3>
                                    <p>${track.plays} plays</p>
                                </div>
                                <span class="track-album">${track.album}</span>
                                <span class="track-duration">${track.duration}</span>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <section class="albums">
                    <h2>Albums</h2>
                    <div class="albums-grid">
                        ${artistData.popularAlbums.map(album => `
                            <div class="album-card">
                                <img src="${album.image}" alt="${album.title}">
                                <h3>${album.title}</h3>
                                <p>${album.tracks} tracks</p>
                            </div>
                        `).join('')}
                    </div>
                </section>
            </div>
        `;

        showPage('artist-page');
    }

    /**
     * Shows the album page with the specified album data.
     * @param {string} albumId - The ID of the album to display.
     */
    function showAlbumPage(albumId) {
        // Example album data (replace with actual data fetching)
        const albumData = {
            title: 'Alpine Serenity',
            artist: 'Nature\'s Harmony',
            year: '2024',
            duration: '8 songs, 42 min 15 sec',
            songs: [
                { id: 1, title: 'Mountain Stream', duration: '3:15' },
                { id: 2, title: 'Alpine Meadow', duration: '5:20' },
                { id: 3, title: 'Glacier Echo', duration: '6:45' },
                { id: 4, title: 'Mountain Mist', duration: '4:30' },
                { id: 5, title: 'Summit Sunrise', duration: '7:15' },
                { id: 6, title: 'Valley Winds', duration: '5:45' },
                { id: 7, title: 'Crystal Lake', duration: '6:10' },
                { id: 8, title: 'Evening Peak', duration: '3:15' }
            ]
        };

        currentAlbum = albumData;
        const albumPage = document.getElementById('album-page');
        if (!albumPage) return;

        // Update header
        albumPage.querySelector('.album-header img').src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=232&q=80';
        albumPage.querySelector('.album-header .details h1').textContent = albumData.title;
        albumPage.querySelector('.album-header .details .meta span:nth-child(2)').textContent = albumData.artist;
        albumPage.querySelector('.album-header .details .meta span:nth-child(4)').textContent = albumData.year;
        albumPage.querySelector('.album-header .details .meta span:nth-child(6)').textContent = albumData.duration;

        // Populate song list
        const songList = albumPage.querySelector('.song-list');
        const songListHeader = songList.querySelector('.song-list-header');
        songList.innerHTML = ''; // Clear existing content
        songList.appendChild(songListHeader); // Re-add header

        albumData.songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.innerHTML = `
                <div>${index + 1}</div>
                <div class="title-cell">
                    <div class="song-info">
                        <div class="song-name">${song.title}</div>
                    </div>
                </div>
                <div>-</div>
                <div>${song.duration}</div>
            `;
            songList.appendChild(songItem);
        });

        showPage('album-page');
    }

    function populateChat() {
        const chatContainer = document.querySelector('.chat-messages');
        if (!chatContainer) return;

        chatContainer.innerHTML = '';
        chatMessages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `chat-message ${msg.sender === 'TerraTune' ? 'app-message' : 'user-message'}`;
            messageElement.innerHTML = `
                <div class="message-content">
                    <div class="message-header">
                        <span class="sender">${msg.sender}</span>
                        <span class="timestamp">${msg.timestamp}</span>
                    </div>
                    <div class="message-text">${msg.message}</div>
                </div>
            `;
            chatContainer.appendChild(messageElement);
        });
        
        // Scroll to bottom of chat
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Add chat input handling
    const chatInput = document.querySelector('.chat-input input');
    const chatSendButton = document.querySelector('.chat-input button');

    function sendMessage() {
        if (!chatInput || !chatInput.value.trim()) return;
        
        const newMessage = {
            sender: "User",
            message: chatInput.value.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        chatMessages.push(newMessage);
        
        // Add automated response
        setTimeout(() => {
            const response = {
                sender: "TerraTune",
                message: "Thanks for your message! 🌿 Our team will get back to you soon.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            chatMessages.push(response);
            populateChat();
        }, 1000);
        
        chatInput.value = '';
        populateChat();
    }

    chatSendButton?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // ==========
    // Event Listeners
    // ==========

    // --- Sidebar Toggle Button ---
    sidebarToggle?.addEventListener('click', toggleSidebar);

    // --- Player Bar Controls ---
    playerPlayPauseButton?.addEventListener('click', togglePlayPause);
    progressBar?.addEventListener('click', (e) => handleProgressClick(e, progressBar)); 
    volumeSlider?.addEventListener('input', handleVolumeChange);
    volumeIconButton?.addEventListener('click', toggleMute);
    // Player Bar Song Info Click -> Show Fullscreen Player
    songInfoContainer?.addEventListener('click', showNowPlayingView);

    // --- Fullscreen Now Playing Controls ---
    minimizePlayerButton?.addEventListener('click', hideNowPlayingView);
    npPlayPauseButton?.addEventListener('click', togglePlayPause); // Re-use toggle function
    npProgressBar?.addEventListener('click', (e) => handleProgressClick(e, npProgressBar)); // Use specific bar

    // --- Sidebar Navigation Links ---
    navLinks?.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetHref = link.getAttribute('href');
            if (targetHref) {
                 const targetId = targetHref.substring(1) + '-page';
                 showPage(targetId);
            } else {
                 console.warn("Navigation link missing href attribute.");
            }
        });
    });
    likedSongsLink?.addEventListener('click', (e) => {
         e.preventDefault();
         showPage('liked-page'); 
    });

    // --- Profile Icon Link in Header ---
     profileLinkIcon?.addEventListener('click', () => {
         showPage('profile-page');
     });

    // --- Generic Click Handler for Content Items (Event Delegation) ---
    mainContent?.addEventListener('click', (e) => {
        const clickableItem = e.target.closest('.clickable');
        if (clickableItem) {
            const type = clickableItem.dataset.type;
            const id = clickableItem.dataset.id;
            
            if (type === 'artist') {
                showArtistPage(id);
            } else if (type === 'album') {
                showAlbumPage(id);
            } else if (type === 'now-playing' || type === 'song') {
                showNowPlayingView();
            } else {
                showContentView(type, id, clickableItem.querySelector('h4')?.textContent || 'Details');
            }
        }
    });

     // --- Back Button in Content View ---
     backButton?.addEventListener('click', goBack);

    // --- Profile Dropdown ---
    profileButton?.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling to document
        profileDropdown?.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (profileDropdown?.classList.contains('active') && 
            !profileDropdown.contains(e.target) && 
            e.target !== profileButton) {
            profileDropdown.classList.remove('active');
        }
    });

    // ==========
    // Initialization
    // ==========
    
    for (let i = 0; i < 20; i++) createFallingLeaf();
    updatePlayerUI();
    updateVolumeUI();
    showPage('home-page'); // Start on home page
    populateChat();

}); 