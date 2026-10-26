"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const net_1 = __importDefault(require("net"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const child_process_1 = require("child_process");
const isDev = !electron_1.app.isPackaged;
let win = null;
let serverProcess = null;
function loadDbConfig() {
    const envFile = isDev
        ? path_1.default.join(electron_1.app.getAppPath(), '.env')
        : path_1.default.join(process.resourcesPath, 'standalone', '.env');
    const contents = fs_1.default.readFileSync(envFile, 'utf-8');
    return Object.fromEntries(contents
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
        const separator = line.indexOf('=');
        if (separator < 1)
            return null;
        const key = line.slice(0, separator).trim();
        let value = line.slice(separator + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        return [key, value];
    })
        .filter((entry) => entry !== null));
}
function getFreePort() {
    return new Promise((resolve) => {
        const srv = net_1.default.createServer();
        srv.listen(0, '127.0.0.1', () => {
            const { port } = srv.address();
            srv.close(() => resolve(port));
        });
    });
}
function waitForServer(url, timeoutMs = 60000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const attempt = () => {
            http_1.default
                .get(url, (res) => {
                res.resume();
                resolve();
            })
                .on('error', () => {
                if (Date.now() - start > timeoutMs)
                    return reject(new Error(`Server timeout setelah ${timeoutMs / 1000}s. Pastikan MySQL berjalan dan konfigurasi DB benar.`));
                setTimeout(attempt, 500);
            });
        };
        attempt();
    });
}
async function startNextServer() {
    const port = await getFreePort();
    const serverDir = path_1.default.join(process.resourcesPath, 'standalone');
    const serverScript = path_1.default.join(serverDir, 'server.js');
    console.log(`[electron] Starting Next.js server from: ${serverScript}`);
    console.log(`[electron] Port: ${port}, CWD: ${serverDir}`);
    const dbConfig = loadDbConfig();
    const env = {
        ...process.env,
        ...dbConfig,
        PORT: String(port),
        HOSTNAME: '127.0.0.1',
        NODE_ENV: 'production',
    };
    return new Promise((resolve, reject) => {
        serverProcess = (0, child_process_1.fork)(serverScript, [], {
            cwd: serverDir,
            env,
            stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
        });
        serverProcess.stdout?.on('data', (d) => {
            const msg = d.toString();
            console.log(`[next] ${msg.trim()}`);
        });
        serverProcess.stderr?.on('data', (d) => {
            const msg = d.toString();
            console.error(`[next:err] ${msg.trim()}`);
        });
        serverProcess.on('exit', (code, signal) => {
            console.error(`[next] Process exited: code=${code} signal=${signal}`);
            reject(new Error(`Server Next.js keluar dengan kode ${code}. Cek apakah MySQL aktif dan DB_NAME="${dbConfig.DB_NAME}" ada.`));
        });
        serverProcess.on('error', (err) => {
            console.error(`[next] Fork error:`, err);
            reject(new Error(`Gagal menjalankan server: ${err.message}`));
        });
        // Tunggu server siap
        waitForServer(`http://127.0.0.1:${port}`)
            .then(() => resolve(port))
            .catch(reject);
    });
}
async function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: { contextIsolation: true, nodeIntegration: false },
    });
    try {
        if (isDev) {
            await win.loadURL('http://localhost:3000');
        }
        else {
            const port = await startNextServer();
            await win.loadURL(`http://127.0.0.1:${port}`);
        }
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await win.loadURL('data:text/html;charset=utf-8,' +
            encodeURIComponent(`<h3>Gagal memulai aplikasi</h3><pre>${msg}</pre>`));
        win.webContents.openDevTools({ mode: 'detach' });
    }
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('before-quit', () => {
    serverProcess?.kill();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
