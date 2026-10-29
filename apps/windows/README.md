# Windows desktop build

1. Install Node.js 20+.
2. Run `npm install` in this directory.
3. Set `GAME_URL` to the deployed HTTPS game URL (or run the API locally and use `http://localhost:3000/game/`).
4. Run `npm start` to test.
5. Run `npm run dist` on Windows to create an NSIS installer in `release/`.

This first desktop wrapper loads the online game from Render and therefore requires an internet connection. The installer link will only be available after a successful Windows build.
