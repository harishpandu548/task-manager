import net from 'node:net';
export async function isRedisReachable(redisUrl, timeoutMs = 800) {
    try {
        const url = new URL(redisUrl);
        const host = url.hostname || '127.0.0.1';
        const port = Number(url.port || 6379);
        return await new Promise((resolve) => {
            const socket = new net.Socket();
            const finalize = (status) => {
                socket.removeAllListeners();
                socket.destroy();
                resolve(status);
            };
            socket.setTimeout(timeoutMs);
            socket.once('connect', () => finalize(true));
            socket.once('timeout', () => finalize(false));
            socket.once('error', () => finalize(false));
            socket.connect(port, host);
        });
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=redisAvailability.js.map