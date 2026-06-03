# App-for-Web-Architectures

A starter monorepo for a community challenge app with React + Vite frontend and Express backend.

## Structure

- `frontend/` — Vite React app on port 5173
- `backend/` — Express API server on port 3000

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start both apps:
   ```bash
   npm run dev
   ```

## Features included

- Discover page for public approved challenges
- Calendar view for today’s due challenges
- Profile page with friends and challenge overview
- Challenge details with proof post submission
- Create challenge form with approval / private settings
- Express API with challenge, user, and posts routes

## Notes

- Private challenges require approval and are not discoverable.
- The app uses an in-memory backend dataset for a fast prototype.
