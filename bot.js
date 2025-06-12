const mc = require('bedrock-protocol');

const client = mc.createClient({
  host: 'ysrhameed.aternos.me',
  port: 23539,
  username: 'SmartBotPE'
});

let tick = 0;
let task = 'idle';
let memory = {
  explored: 0,
  treesCut: 0,
  builtShelter: false
};
let inventory = {
  wood: 0,
  cobble: 0,
  dirt: 0,
  food: 0
};

const basePos = { x: 100, y: 64, z: 100 };

client.on('spawn', () => {
  console.log('SmartBot spawned.');
  sendChat('🧠 SmartBot PE ready for survival.');
  mainLoop();
});

function mainLoop() {
  setInterval(() => {
    tick++;

    task = chooseTask();

    switch (task) {
      case 'explore': explore(); break;
      case 'cut_tree': cutTree(); break;
      case 'mine': mineStone(); break;
      case 'build_shelter': buildShelter(); break;
      case 'idle': sayThinking(); break;
    }

  }, 5000); // Every 5 seconds
}

function chooseTask() {
  if (inventory.wood < 10 && memory.treesCut < 5) return 'cut_tree';
  if (inventory.cobble < 8) return 'mine';
  if (!memory.builtShelter && tick > 60) return 'build_shelter';
  if (memory.explored < 10) return 'explore';
  return 'idle';
}

function explore() {
  const dx = Math.floor(Math.random() * 6 - 3);
  const dz = Math.floor(Math.random() * 6 - 3);
  const x = basePos.x + dx + memory.explored;
  const z = basePos.z + dz;
  const y = 64;

  moveBot(x, y, z);
  memory.explored++;
  sendChat("Exploring... 🌍");
}

function cutTree() {
  const bx = basePos.x + Math.floor(Math.random() * 4);
  const bz = basePos.z + Math.floor(Math.random() * 4);
  const pos = { x: bx, y: 64, z: bz };

  client.queue('level_event', { event_id: 3600, position: pos, data: 0 });

  inventory.wood += 2;
  memory.treesCut++;
  sendChat("Cut a tree. 🌲 Got some wood!");
}

function mineStone() {
  const bx = basePos.x + Math.floor(Math.random() * 2);
  const bz = basePos.z + Math.floor(Math.random() * 2);
  const pos = { x: bx, y: 62, z: bz }; // underground

  client.queue('level_event', { event_id: 3600, position: pos, data: 0 });

  inventory.cobble += 3;
  sendChat("Mined some stone. ⛏️");
}

function buildShelter() {
  sendChat("Building shelter... 🏠");

  for (let dx = 0; dx < 3; dx++) {
    for (let dz = 0; dz < 3; dz++) {
      const bx = basePos.x + dx;
      const bz = basePos.z + dz;
      const pos = { x: bx, y: 64, z: bz };

      client.queue('player_action', { action: 0, position: pos, face: 1 });
    }
  }

  inventory.wood -= 5;
  memory.builtShelter = true;
}

function sayThinking() {
  const thoughts = [
    "Thinking what to do next...",
    "Maybe I should eat... if I had food.",
    "I feel lonely here.",
    "Hope mobs don't come at night.",
    "Should I build a chest soon?"
  ];

  sendChat(thoughts[Math.floor(Math.random() * thoughts.length)]);
}

function moveBot(x, y, z) {
  client.queue('move_player', {
    runtime_id: client.entityId,
    position: { x, y, z },
    rotation: { x: 0, y: 0 },
    mode: 0,
    on_ground: true,
    tick: 0
  });

  console.log(`Moved to (${x}, ${z})`);
}

function sendChat(msg) {
  client.queue('text', {
    type: 'chat',
    needs_translation: false,
    source_name: client.options.username,
    message: msg
  });
  
