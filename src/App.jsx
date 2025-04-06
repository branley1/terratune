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
        <div className="flex flex-col h-screen bg-secondary-900 text-white">
          <div className="flex flex-1 overflow-hidden">
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
                <Route path="/playlist/:id" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Routes>
            </Layout>
          </div>
          <div className="h-48">
            <Visualizer />
          </div>
          <Player />
        </div>
      </AudioProvider>
    </AuthProvider>
  )
}

export default App 