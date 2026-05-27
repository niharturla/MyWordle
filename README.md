 Wordly — Daily 5-Letter Word Game
A clean, modern Wordle-style word guessing game built with React and TanStack Start. Guess the hidden 5-letter word in 6 tries. Play the daily puzzle or practice with unlimited random games.
![Game Screenshot](https://via.placeholder.com/800x400?text=Wordly+Game)

Run: https://mywordleapp.lovable.app/

## Features
- **Daily Puzzle** — A new word every day, shared by all players
- **Practice Mode** — Play unlimited random games after completing the daily
- **Real-time Feedback** — Green, yellow, and gray tile hints after each guess
- **On-screen Keyboard** — Color-coded keys track your letter knowledge
- **Statistics** — Track games played, win rate, streaks, and guess distribution
- **Share Results** — Copy emoji grids to clipboard to share with friends
- **Dark Mode** — Automatic light/dark theme support
- **Persistent State** — Game progress and stats saved locally
## Tech Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Framework:** TanStack Start (full-stack React with SSR)
- **State Management:** TanStack Query
- **Backend:** Cloudflare Workers-compatible server functions
- **Build Tool:** Vite 7
## Prerequisites
- [Node.js](https://nodejs.org/) 18+ (or [Bun](https://bun.sh/) 1.0+)
- A package manager: `npm`, `yarn`, `pnpm`, or `bun`
## Getting Started
### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```
### 2. Install Dependencies
Using Bun (recommended — fastest):
```bash
bun install
```
Using npm:
```bash
npm install
```
Using yarn:
```bash
yarn install
```
### 3. Start the Development Server
Using Bun:
```bash
bun run dev
```
Using npm:
```bash
npm run dev
```
The app will start at `http://localhost:3000` (or another port if 3000 is in use). The terminal will show the exact URL.
### 4. Open in Browser
Navigate to the URL shown in your terminal. The app features hot reloading — any code changes will refresh the page automatically.
---
## Building for Production
Create an optimized production build:
```bash
bun run build
# or
npm run build
```
Preview the production build locally:
```bash
bun run preview
# or
npm run preview
```
---
## Running with Docker
A `Dockerfile` and `docker-compose.yml` are included for containerized deployment.
### Quick Start with Docker Compose
```bash
docker-compose up --build
```
The app will be available at `http://localhost:3000`.
### Using Docker Directly
```bash
# Build the image
docker build -t wordly-app .
# Run the container
docker run -p 3000:3000 wordly-app
```
---
## Available Scripts
| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |
---
## Project Structure
```
├── src/
│   ├── components/
│   │   ├── wordle/           # Game components
│   │   │   ├── WordleGame.tsx    # Main game logic & state
│   │   │   ├── GameBoard.tsx     # 6x5 guess grid
│   │   │   ├── Tile.tsx          # Individual letter tile
│   │   │   ├── Keyboard.tsx      # On-screen keyboard
│   │   │   ├── Header.tsx        # Top bar with stats/help buttons
│   │   │   ├── StatsModal.tsx    # Statistics & share
│   │   │   ├── HelpModal.tsx     # How to play instructions
│   │   │   └── Toast.tsx         # Notification messages
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   ├── words.ts          # Word lists & scoring logic
│   │   ├── game-storage.ts   # LocalStorage persistence
│   │   └── utils.ts          # Utility functions
│   ├── routes/
│   │   ├── index.tsx         # Home page
│   │   ├── __root.tsx        # Root layout
│   │   └── api/
│   │       ├── daily.ts      # Daily puzzle endpoint
│   │       └── guess.ts      # Guess validation endpoint
│   ├── router.tsx            # TanStack Router setup
│   ├── server.ts             # SSR entry point
│   ├── start.ts              # Server start configuration
│   └── styles.css            # Global styles & CSS variables
├── Dockerfile
├── docker-compose.yml
├── vite.config.ts
├── package.json
└── tsconfig.json
```
---
## How to Play
1. **Goal:** Guess the hidden 5-letter word in 6 tries.
2. **Submit a guess:** Type a 5-letter word and press **Enter**.
3. **Read the colors:**
   - **Green** — Letter is correct and in the right position
   - **Yellow** — Letter exists in the word but is in the wrong position
   - **Gray** — Letter is not in the word
4. **Use the keyboard** — Keys change color to help track which letters you've tried.
5. **Win or lose** — Guess correctly within 6 tries, or see the answer.
6. **Play again** — After the daily puzzle, click **New Game** for unlimited practice rounds.
---
## Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Enter` | Submit guess |
| `Backspace` | Delete last letter |
| `A-Z` | Type letters |
---
## Customization
### Adding More Words
Edit `src/lib/words.ts` to expand the answer list:
```typescript
export const ANSWERS = [
  "apple", "beach", "crane", /* ... add your words ... */
];
```
### Styling
The app uses CSS variables defined in `src/styles.css`. Modify the color tokens there to change the theme:
```css
:root {
  --primary: oklch(0.55 0.15 140);      /* Green accent */
  --secondary: oklch(0.7 0.12 85);      /* Yellow accent */
  /* ... */
}
```
---
## Troubleshooting
### Port 3000 is already in use
Vite will automatically try the next available port. Check your terminal for the actual URL, or specify a port:
```bash
bun run dev -- --port 5173
```
### Dependencies won't install
Ensure you're using Node.js 18+ or Bun 1.0+:
```bash
node --version   # Should be v18.x.x or higher
bun --version    # Should be 1.0.0 or higher
```
Delete `node_modules` and the lock file, then reinstall:
```bash
rm -rf node_modules bun.lock
bun install
```
### Docker build fails
Make sure Docker Desktop (or Docker Engine) is running and you have sufficient disk space:
```bash
docker --version
```
---
