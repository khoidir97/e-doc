import { app, BrowserWindow } from 'electron';
import path from 'path';
import net from 'net';
import fs from 'fs';
import http from 'http';
import { fork, ChildProcess } from 'child_process';

const isDev = !app.isPackaged;
let win: BrowserWindow | null = null;
let serverProcess: ChildProcess | null = null;

function loadDbConfig(): Record<string, string> {
    const envFile = isDev
        ? path.join(app.getAppPath(), '.env')
        : path.join(process.resourcesPath, 'standalone', '.env');
    const contents = fs.readFileSync(envFile, 'utf-8');

    return Object.fromEntries(
        contents
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('#'))
            .map((line) => {
                const separator = line.indexOf('=');
                if (separator < 1) return null;

                const key = line.slice(0, separator).trim();
                let value = line.slice(separator + 1).trim();
                if (
                    (value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))
                ) {
                    value = value.slice(1, -1);
                }
                return [key, value] as const;
            })
            .filter((entry): entry is readonly [string, string] => entry !== null),
    );
}

function getFreePort(): Promise<number> {
    return new Promise((resolve) => {
        const srv = net.createServer();
        srv.listen(0, '127.0.0.1', () => {
            const { port } = srv.address() as net.AddressInfo;
            srv.close(() => resolve(port));
        });
    });
}

function waitForServer(url: string, timeoutMs = 60000): Promise<void> {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const attempt = () => {
            http
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

async function startNextServer(): Promise<number> {
    const port = await getFreePort();
    const serverDir = path.join(process.resourcesPath, 'standalone');
    const serverScript = path.join(serverDir, 'server.js');

    console.log(`[electron] Starting Next.js server from: ${serverScript}`);
    console.log(`[electron] Port: ${port}, CWD: ${serverDir}`);

    const dbConfig = loadDbConfig();
    const env: NodeJS.ProcessEnv = {
        ...process.env,
        ...dbConfig,
        PORT: String(port),
        HOSTNAME: '127.0.0.1',
        NODE_ENV: 'production',
    };

    return new Promise((resolve, reject) => {
        serverProcess = fork(serverScript, [], {
            cwd: serverDir,
            env,
            stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
        });

        serverProcess.stdout?.on('data', (d: Buffer) => {
            const msg = d.toString();
            console.log(`[next] ${msg.trim()}`);
        });

        serverProcess.stderr?.on('data', (d: Buffer) => {
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
    win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: { contextIsolation: true, nodeIntegration: false },
    });

    try {
        if (isDev) {
            await win.loadURL('http://localhost:3000');
        } else {
            const port = await startNextServer();
            await win.loadURL(`http://127.0.0.1:${port}`);
        }
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await win.loadURL(
            'data:text/html;charset=utf-8,' +
            encodeURIComponent(`<h3>Gagal memulai aplikasi</h3><pre>${msg}</pre>`)
        );
        win.webContents.openDevTools({ mode: 'detach' });
    }
}

app.whenReady().then(createWindow);

app.on('before-quit', () => {
    serverProcess?.kill();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});