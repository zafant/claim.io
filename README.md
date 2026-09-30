# CLAIM.IO

A small multiplayer territory-control game built for a €0-first prototype workflow.

## MVP v0.1

- Phaser 3 + TypeScript + Vite
- Single local player
- Grid-based territory
- Trail while outside owned territory
- Territory capture when returning home
- Death when crossing the active trail
- Reset / restart

## Development

```bash
npm install
npm run dev
```

The first milestone is deliberately small: prove that moving out, drawing a trail, returning home, and capturing territory feels good before adding bots or multiplayer.

## Planned stack

- Client: Phaser + TypeScript
- Multiplayer: Colyseus + Node.js
- Repository: GitHub
- Steam client: later, after the core loop is validated

## License

Project code is not licensed for reuse yet. Third-party dependencies keep their own licenses; review every dependency before commercial distribution.
