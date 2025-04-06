# Music Streaming Service

A modern web-based music streaming service built with React, Node.js, PostgreSQL, and Redis.

## Features

- User authentication and authorization
- Music streaming with HTML5 Audio API
- Playlist creation and management
- Search and discovery
- Social features (following artists/users)
- Responsive design with Tailwind CSS
- Real-time audio visualizations

## Tech Stack

- Frontend:
  - React
  - Vite
  - Tailwind CSS
  - React Router
  - HTML5 Audio API
  - Web Audio API

- Backend:
  - Node.js
  - Express
  - PostgreSQL
  - Redis
  - JWT Authentication

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)
- npm or yarn

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/music-streaming.git
   cd music-streaming
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. Set up the database:
   ```bash
   psql -U your_username -d music_streaming -f server/db/init.sql
   ```

5. Start the development servers:
   ```bash
   # Start the backend server
   npm run start:server

   # Start the frontend development server
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Development

### Project Structure

```
music-streaming/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── server/                # Backend source code
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── db/                # Database related files
│   └── utils/             # Utility functions
├── public/                # Static assets
└── tests/                 # Test files
```

### Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run build` - Build the frontend for production
- `npm run start:server` - Start the backend server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set up production environment variables:
   ```bash
   cp .env.example .env.production
   ```
   Edit `.env.production` with production values.

3. Deploy the backend:
   ```bash
   npm run start:server
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
