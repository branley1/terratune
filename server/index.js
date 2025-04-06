import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDatabase, getDb, saveDatabase } from './db/index.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import trackRoutes from './routes/tracks.js';
import playlistRoutes from './routes/playlists.js';
import searchRoutes from './routes/search.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001; // Fixed port to avoid conflicts
let serverInstance; // To keep track of the server instance

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Added PATCH
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/search', searchRoutes);

// Simple root route for health check / basic response
app.get('/', (req, res) => {
  res.status(200).send('Server is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[Server Error Middleware]", err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong!' 
  });
});

// Function to handle shutdown logic
let isShuttingDown = false;
const shutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`[Server] Received ${signal}. Shutting down gracefully...`);
  
  try {
    console.log('[Server] Closing HTTP server...');
    await new Promise((resolve, reject) => {
      if (serverInstance) {
        serverInstance.close((err) => {
          if (err) {
            console.error('[Server] Error closing HTTP server:', err);
            return reject(err);
          }
          console.log('[Server] HTTP server closed.');
          resolve();
        });
      } else {
        resolve(); // No server instance to close
      }
    });

    console.log('[Server] Saving database...');
    saveDatabase(); // Consider making saveDatabase async if it involves async I/O
    console.log('[Server] Database saved.');
    
    console.log('[Server] Shutdown complete.');
    process.exit(0);

  } catch (err) {
    console.error('[Server] Error during graceful shutdown:', err);
    process.exit(1); // Exit with error code
  }
};

// Initialize database and start server
initDatabase().then(() => {
  console.log('[Server] Database initialized successfully.');

  serverInstance = app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
    console.log(`[Server] API available at http://localhost:${PORT}/api`);
  });

  serverInstance.on('error', (error) => {
    console.error('[Server] Startup Error:', error);
    shutdown('startup_error'); // Attempt cleanup on startup error
  });

  // Listen for termination signals
  process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C
  process.on('SIGTERM', () => shutdown('SIGTERM')); // kill / termination
  process.on('uncaughtException', (err, origin) => {
    console.error('[Server] Uncaught Exception:', err, 'Origin:', origin);
    shutdown('uncaughtException'); // Attempt graceful shutdown
  });
  process.on('unhandledRejection', (reason, promise) => {
    console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection'); // Attempt graceful shutdown
  });

}).catch(err => {
  console.error('[Server] Critical Failure: Failed to initialize database:', err);
  process.exit(1);
}); 