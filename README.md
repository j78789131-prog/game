# Paris Drive — realistic 3D driving game

A cross-platform driving-game project for Android (Expo APK), Windows (Electron), and browser. The game client uses Three.js; the online API uses Node.js/Express and MongoDB Atlas.

## Project layout

- `server.js` — Render Web Service API, MongoDB-backed registration/login.
- `public/game/` — browser 3D driving prototype served by Render.
- `apps/android/` — Expo Android wrapper; build an APK with EAS.
- `apps/windows/` — Electron desktop wrapper.
- `ASSETS.md` — model candidates and licence notes.

## Development in GitHub Codespaces

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
4. Run `npm run dev`.
5. Open the forwarded port 3000.

## Render

Create a regular **Web Service** (not a Blueprint) from this repository's `main` branch. Build command: `npm install`; start command: `npm start`. Set `MONGODB_URI`, `JWT_SECRET`, and optionally `CLIENT_ORIGIN` in Render Environment. Use MongoDB Atlas for the database.

## Android APK

From `apps/android`, install dependencies and configure `EXPO_PUBLIC_GAME_URL` to your deployed game URL. Use an Expo/EAS Android APK build profile; see `apps/android/README.md`.

## Windows

From `apps/windows`, set `GAME_URL` to the deployed game URL and package with Electron Builder. See `apps/windows/README.md`.

## Security

Never commit `.env`, MongoDB credentials, or JWT secrets. The API hashes passwords with bcrypt and returns signed JWTs. This is an initial prototype and still needs production hardening, rate limiting, and full device testing before public release.
