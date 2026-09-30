# CLAIM.IO

CLAIM.IO is a small browser-first territory-capture game prototype.

## Current prototype: v0.1

The current build contains the core single-player loop:

- Move with WASD or arrow keys.
- Start inside your territory.
- Leave your territory to create a trail.
- Return to owned territory to claim enclosed space.
- Touching your own trail ends the run.
- Press `R` after losing to restart.
- The HUD shows the percentage of the map you own.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Vite will print the local URL, normally `http://localhost:5173`.

For a production build:

```bash
npm run build
```

The browser bundle is generated in `client/dist`.

## Cloudflare Pages test deployment

Cloudflare Pages can connect directly to this GitHub repository and automatically deploy every push. Use:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `client/dist`

Cloudflare will provide a `*.pages.dev` URL. Use that URL to test the current browser build on desktop and mobile browsers.

## Test checklist

### Core movement

- [ ] WASD moves the player.
- [ ] Arrow keys move the player.
- [ ] The player cannot reverse direction directly into itself.
- [ ] Leaving the territory creates a visible trail.

### Claiming

- [ ] Returning to owned territory claims the enclosed area.
- [ ] The territory percentage increases when space is captured.
- [ ] The trail disappears after a successful claim.

### Losing

- [ ] Hitting the map boundary ends the run.
- [ ] Crossing the player's trail ends the run.
- [ ] The Game Over message shows the final territory percentage.
- [ ] `R` starts a fresh run.

### Browser compatibility

- [ ] Chrome/Edge desktop
- [ ] Firefox desktop
- [ ] Safari desktop/iOS
- [ ] Android Chrome

## Roadmap

1. v0.1 — core territory loop
2. v0.2 — bots and better collision/game feel
3. v0.3 — authoritative multiplayer with Colyseus
4. v0.4 — match flow and leaderboard
5. v0.5 — resources, power-ups and progression
6. v1.0 — Steam build and Steamworks integration
