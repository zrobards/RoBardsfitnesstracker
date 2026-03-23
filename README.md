# RoBards Training Log

A mobile-first workout tracking PWA built for the **7-Day PPL / UL Strength + Hypertrophy** program. Designed for fast, frictionless logging during gym sessions on iPhone.

## Features

- **7 preloaded workout days** with full exercise details, sets, reps, core circuits, and stretching
- **Quick Log mode** — tap through sets rapidly with auto-advance
- **Rest timer** with preset buttons (60s, 90s, 2m, 3m) and custom input
- **Session tracking** with elapsed time, volume, and progress bar
- **Workout history** grouped by month with full session details
- **Progress charts** — exercise progression, personal records, weekly volume
- **Muscle volume summary** — estimated weekly sets per muscle group with recommended ranges
- **Bodyweight tracker** with chart
- **Exercise library** searchable by name or muscle group
- **Exercise substitution** support (Pull-Ups / Lat Pulldown, etc.)
- **Export/Import** data as JSON
- **PWA** — installable on iPhone home screen, works offline
- **Dark theme** optimized for gym use

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Recharts (charts)
- Lucide React (icons)
- Local Storage persistence
- Vite PWA Plugin + Workbox

## Quick Start

```bash
npm install
npm run dev
```

## Build & Preview

```bash
npm run build
npm run preview
```

## Deploy to Netlify

1. Push to GitHub
2. Go to netlify.com -> New Site -> Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`

Add a `public/_redirects` file for SPA routing (already included):
```
/*    /index.html   200
```

## Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo at vercel.com.

## Install as PWA on iPhone

1. Open the deployed URL in **Safari**
2. Tap the **Share** button (square with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **Add**

The app runs fullscreen like a native app.

## Data Storage

All data lives in localStorage with the `robards_` prefix:

| Key | Content |
|-----|---------|
| `robards_activeSession` | Current in-progress workout |
| `robards_sessions` | Completed workout history |
| `robards_templates` | Workout templates (editable) |
| `robards_bodyweight` | Bodyweight entries |
| `robards_settings` | User preferences |

## Editing Workouts

- **In the app:** Go to Workouts, tap a day, modify exercises/sets/reps
- **In code:** Edit `src/data/workoutPlan.js`
- **Reset:** Settings -> "Reset Workout Templates" restores defaults
- **Duplicate:** Workouts -> "Duplicate" creates a customizable copy

## Adding Cloud Sync Later

The app is structured for easy backend integration:

1. Replace localStorage in `src/utils/storage.js` with Supabase/Firebase calls
2. Add auth and wrap routes
3. Data model maps directly to database tables
4. Context can be extended with real-time subscriptions
