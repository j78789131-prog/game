const { app, BrowserWindow, shell } = require('electron');

const GAME_URL = process.env.GAME_URL || 'https://driving-game-4w88.onrender.com/game/';

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#101720',
    title: 'Paris Drive',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (!isMainFrame || validatedURL.startsWith('data:')) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Paris Drive - Connection problem</title><style>body{margin:0;background:#101720;color:#edf4fb;font:16px system-ui;display:grid;place-items:center;min-height:100vh}.card{max-width:560px;margin:24px;padding:32px;border:1px solid #ffffff25;border-radius:18px;background:#172333}h1{color:#f5b74f}p{line-height:1.6;color:#c6d3e0}a,button{display:inline-block;background:#f5a623;color:#111a25;padding:12px 18px;border:0;border-radius:9px;text-decoration:none;font-weight:700;cursor:pointer;margin:6px 8px 0 0}</style></head><body><div class="card"><h1>Paris Drive</h1><p>The game server could not be reached. Check your internet connection and whether the Render service is awake, then try again.</p><button onclick="location.href='${GAME_URL}'">Try again</button><a href="https://driving-game-4w88.onrender.com/game/" target="_blank">Open game in browser</a><p style="font-size:12px">Connection error: ${String(errorCode)} — ${String(errorDescription)}</p></div></body></html>`;
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
  });

  win.loadURL(GAME_URL);
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
