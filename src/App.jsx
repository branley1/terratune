import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AudioProvider } from './contexts/AudioContext'
import { UIProvider } from './contexts/UIContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import Library from './pages/Library'
import Playlist from './pages/Playlist'
import Profile from './pages/Profile'
import Player from './components/Player'
import ProtectedRoute from './components/ProtectedRoute'
import NowPlayingOverlay from './components/NowPlayingOverlay'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UIProvider>
          <AudioProvider>
            <div className="flex flex-col bg-gradient-to-br from-primary via-secondary to-tertiary text-white min-h-screen">
              <div className="flex-grow flex flex-col">
                <Routes>
                  {/* Auth routes without layout */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/logout" element={<Navigate to="/login" replace />} />
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/playlist/:id" element={<Playlist />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>
                  </Route>
                </Routes>
              </div>
              <ErrorBoundary>
                <Player />
              </ErrorBoundary>
              <NowPlayingOverlay />
            </div>
          </AudioProvider>
        </UIProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App 