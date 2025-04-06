import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AudioProvider } from './contexts/AudioContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import Library from './pages/Library'
import Playlist from './pages/Playlist'
import Profile from './pages/Profile'
import Player from './components/Player'
import Visualizer from './components/Visualizer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <div className="flex flex-col h-screen bg-gradient-to-br from-primary via-secondary to-tertiary text-white overflow-hidden">
          <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes with layout */}
            <Route element={<Layout><ProtectedRoute /></Layout>}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlist/:id" element={<Playlist />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
          <Player />
        </div>
      </AudioProvider>
    </AuthProvider>
  )
}

export default App 