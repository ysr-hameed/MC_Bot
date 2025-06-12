require('dotenv').config();
const { createClient } = require('bedrock-protocol');
const Vec3 = require('vec3');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const bot = createClient({
  host: 'ysrhameed.aternos.me',
  port: 23539,
  version: '1.21.80',
  offline: false,
  username: process.env.XBOX_EMAIL,
  password: process.env.XBOX_PASSWORD,
  authTitle: 'minecraft',
  skipEditProfile: true
});

bot.on('join', async () => {
  console.log('✅ Bot joined the server!');
  await mainLoop();
});

bot.on('disconnect', reason => {
  console.log('❌ Disconnected:', reason);
});

bot.on('error', err => {
  console.error('❌ Error:', err);
});

// === Logic Starts ===

async function mainLoop() {
  try {
    while (true) {
      await gatherWood();
      await buildHouse();
      await craftAndPlaceBed();
      await storeItemsInChest();
      console.log('✅ Task cycle complete. Sleeping 30 sec...');
      await sleep(30000);
    }
  } catch (e) {
    console.error('❌ Bot crashed in loop:', e);
  }
}

async function gatherWood() {
  console.log('🪵 Gathering wood...');
  // In real version, bot would scan nearby blocks
  // Simulate collecting logs
  await sleep(3000);
  console.log('✅ Collected logs.');
}

async function buildHouse() {
  console.log('🏠 Building house...');
  // Build 3x3x2 cube house
  await sleep(5000);
  console.log('✅ House built.');
}

async function craftAndPlaceBed() {
  console.log('🛏️ Crafting and placing bed...');
  // Check wool + planks → craft bed → place
  await sleep(2000);
  console.log('✅ Bed crafted and placed.');
}

async function storeItemsInChest() {
  console.log('📦 Storing items in chest...');
  // Simulate chest placement and storage
  await sleep(2000);
  console.log('✅ Items stored.');
}
