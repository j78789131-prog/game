# Android APK

1. Install Node.js 20+ and Expo/EAS tooling.
2. In this directory run `npm install`.
3. Set `EXPO_PUBLIC_GAME_URL` to the deployed game URL, for example `https://YOUR-RENDER-SERVICE.onrender.com/game/`.
4. Create an Expo account and configure EAS: `npx eas login`, then `npx eas build:configure`. Replace the placeholder EAS project ID in `app.json` with the ID EAS provides.
5. Build an installable APK: `npx eas build --platform android --profile preview`.

This wrapper currently streams the game from Render, so an internet connection is required. Use HTTPS for the deployed game. The final APK download link will be supplied by the successful EAS build; no APK exists until that build finishes.
