const { createClient } = require('bedrock-protocol');
const Vec3 = require('vec3');

// --- CONFIG ---
const SERVER_HOST = 'ysrhameed.aternos.me';
const SERVER_PORT = 23539;
const BOT_NAME = 'SurvivorBot';

// --- SETUP BOT ---
const client = createClient({
  host: SERVER_HOST,
  port: SERVER_PORT,
  username: BOT_NAME,
  offline: true
});

// --- MEMORY STATE ---
let inventory = {};
let homeBuilt = false;
let hasBed = false;
let storedItems = {};

// --- ON JOIN ---
client.on('join', () => {
  console.log('✅ Bot joined the server!');
  say("🌍 Hello world! I'm SurvivorBot!");
  logicLoop();
});

// --- CHAT RESPONSES ---
client.on('text', (packet) => {
  const msg = packet.message.toLowerCase();
  if (msg.includes('hello') || msg.includes('bot')) {
    say("👋 Hello player! I'm living my best life.");
  }
});

// --- LOGIC LOOP ---
function logicLoop() {
  setInterval(() => {
    doSmartSurvival();
  }, 10000);
}

// --- SMART ACTIONS ---
function doSmartSurvival() {
  if (!homeBuilt) {
    buildHouse();
  } else if (!hasBed) {
    craftBed();
  } else {
    const action = pick(['collect_items', 'store_items', 'explore', 'say_random']);
    switch (action) {
      case 'collect_items': collectItems(); break;
      case 'store_items': storeItems(); break;
      case 'explore': lookAround(); break;
      case 'say_random': say(randomPhrase()); break;
    }
  }
}

// --- ACTIONS ---
function buildHouse() {
  say("🏠 Building house...");
  inventory['wood'] = (inventory['wood'] || 0) + 20;
  homeBuilt = true;
}

function craftBed() {
  if ((inventory['wood'] || 0) >= 3 && (inventory['wool'] || 0) >= 3) {
    say("🛏 Crafting a bed!");
    inventory['wood'] -= 3;
    inventory['wool'] -= 3;
    hasBed = true;
  } else {
    say("❌ Need more wool and wood to make a bed.");
  }
}

function collectItems() {
  const found = pick(['wool', 'wood', 'seeds', 'stone']);
  inventory[found] = (inventory[found] || 0) + 1;
  say(`📦 Collected 1x ${found}. Total: ${inventory[found]}`);
}

function storeItems() {
  say("📥 Storing extra items in chest...");
  Object.keys(inventory).forEach(key => {
    if (inventory[key] > 2) {
      storedItems[key] = (storedItems[key] || 0) + (inventory[key] - 2);
      inventory[key] = 2;
    }
  });
}

function lookAround() {
  say("👀 Looking around...");
  client.queue('move_player', {
    runtime_id: client.entityId,
    position: client.player.position,
    pitch: Math.random() * 90,
    yaw: Math.random() * 360,
    head_yaw: Math.random() * 360,
    mode: 0,
    on_ground: true,
    riding_entity_runtime_id: 0,
    teleportation_cause: 0,
    tick: 0
  });
}

function say(message) {
  client.queue('text', {
    type: 'chat',
    needs_translation: false,
    source_name: BOT_NAME,
    xuid: '',
    platform_chat_id: '',
    message
  });
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomPhrase() {
  const list = [
    "This world is amazing 🌄",
    "I hope I find diamonds 💎",
    "Why do creepers exist?! 💥",
    "Someday I’ll build a castle!",
    "My chest is filling up 😅"
  ];
  return pick(list);
}
