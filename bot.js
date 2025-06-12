require('dotenv').config();
const { createClient } = require('bedrock-protocol');
const Vec3 = require('vec3');

// Setup
const client = createClient({
  host: process.env.SERVER_HOST,
  port: parseInt(process.env.SERVER_PORT),
  username: process.env.BOT_EMAIL,
  offline: false
});

let position = new Vec3(0, 0, 0);
let hasBuiltShelter = false;

// Logging
client.on('join', () => {
  console.log('[✅] Bot joined the server!');
});

client.on('text', (packet) => {
  console.log(`[CHAT] ${packet.source_name}: ${packet.message}`);
});

// Position updates
client.on('move_player', (packet) => {
  if (packet.runtime_id === client.entityId) {
    position = new Vec3(packet.x, packet.y, packet.z);
  }
});

// Example smart behavior
function randomMove() {
  const x = position.x + Math.floor(Math.random() * 5 - 2);
  const z = position.z + Math.floor(Math.random() * 5 - 2);

  client.queue('move_player', {
    runtime_id: client.entityId,
    position: { x: x, y: position.y, z: z },
    pitch: 0,
    yaw: 0,
    head_yaw: 0,
    mode: 0,
    on_ground: true,
    ridden_runtime_id: 0,
    tick: BigInt(Date.now())
  });
  console.log(`[MOVE] Bot moved to ${x}, ${position.y}, ${z}`);
}

// Simulate survival tasks
setInterval(() => {
  randomMove();

  // Example: Build small shelter
  if (!hasBuiltShelter) {
    console.log('[🧱] Building basic shelter...');
    // This is a placeholder — in real bots you need structure & block placement logic.
    hasBuiltShelter = true;
  }
}, 8000);

// Auto reconnect
client.on('disconnect', (reason) => {
  console.error('[❌] Disconnected:', reason);
  setTimeout(() => {
    console.log('[🔄] Reconnecting...');
    client.connect();
  }, 5000);
});
