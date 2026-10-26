import fs from 'node:fs';

const [, , url, output, portArg = '9223'] = process.argv;
if (!url || !output) {
  console.error('Usage: node capture_mobile.mjs <url> <output.png> [port]');
  process.exit(2);
}
const port = Number(portArg);
const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const target = targets.find((entry) => entry.type === 'page');
if (!target) throw new Error('No Chrome page target');

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
let nextId = 1;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id) return;
  const waiter = pending.get(message.id);
  if (!waiter) return;
  pending.delete(message.id);
  if (message.error) waiter.reject(new Error(JSON.stringify(message.error)));
  else waiter.resolve(message.result);
});
function command(method, params = {}) {
  const id = nextId++;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await command('Page.enable');
await command('Runtime.enable');
await command('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: 390,
  screenHeight: 844,
});
await command('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await command('Page.navigate', { url });
await new Promise((resolve) => setTimeout(resolve, 5000));
const metrics = await command('Runtime.evaluate', {
  expression: '({innerWidth,innerHeight,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth})',
  returnByValue: true,
});
const shot = await command('Page.captureScreenshot', {
  format: 'png',
  fromSurface: true,
  captureBeyondViewport: false,
});
fs.writeFileSync(output, Buffer.from(shot.data, 'base64'));
console.log(JSON.stringify(metrics.result.value));
socket.close();
