// Game configuration
const config = {
  moveSpeed: 5,
  citySize: 3000,
  buildingCount: 100,
  neonSignCount: 30
};

// Game state
const gameState = {
  player: {
    x: 0,
    y: 0
  },
  keys: {
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    down: false,
    left: false,
    right: false
  }
};

// DOM elements
const startScreen = document.getElementById('start-screen');
const playButton = document.getElementById('play-button');
const gameWorld = document.getElementById('game-world');
const player = document.getElementById('player');
const cityScene = document.getElementById('city-scene');
const backgroundMusic = document.getElementById('background-music');

// Initialize the game
function initGame() {
  // Generate city
  generateCity();
  
  // Set up event listeners
  setupEventListeners();
  
  // Start game loop
  requestAnimationFrame(gameLoop);
}

// Generate city elements
function generateCity() {
  // Generate buildings
  for (let i = 0; i < config.buildingCount; i++) {
    createBuilding();
  }
  
  // Generate roads
  createRoads();
  
  // Generate neon signs
  for (let i = 0; i < config.neonSignCount; i++) {
    createNeonSign();
  }
}

// Create a random building
function createBuilding() {
  const building = document.createElement('div');
  building.className = 'building';
  
  const width = Math.random() * 150 + 50;
  const height = Math.random() * 300 + 100;
  const x = Math.random() * config.citySize - config.citySize / 2;
  const y = Math.random() * config.citySize - config.citySize / 2;
  
  building.style.width = `${width}px`;
  building.style.height = `${height}px`;
  building.style.left = `${x + config.citySize / 2}px`;
  building.style.top = `${y + config.citySize / 2}px`;
  
  // Add windows to the building
  const windowCount = Math.floor((width / 20) * (height / 30));
  for (let i = 0; i < windowCount; i++) {
    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    
    const windowWidth = 10;
    const windowHeight = 15;
    const windowX = Math.random() * (width - windowWidth - 10) + 5;
    const windowY = Math.random() * (height - windowHeight - 10) + 5;
    
    windowEl.style.width = `${windowWidth}px`;
    windowEl.style.height = `${windowHeight}px`;
    windowEl.style.left = `${windowX}px`;
    windowEl.style.top = `${windowY}px`;
    
    // Random window light (some windows are off)
    if (Math.random() > 0.3) {
      windowEl.style.opacity = Math.random() * 0.5 + 0.3;
      // Flickering effect for some windows
      if (Math.random() > 0.7) {
        windowEl.style.animation = `neon-flicker ${Math.random() * 3 + 1}s infinite alternate`;
      }
    } else {
      windowEl.style.opacity = 0;
    }
    
    building.appendChild(windowEl);
  }
  
  cityScene.appendChild(building);
}

// Create roads in a grid pattern
function createRoads() {
  const roadCount = 10;
  const roadSpacing = config.citySize / roadCount;
  
  for (let i = 0; i < roadCount; i++) {
    // Horizontal road
    const horizontalRoad = document.createElement('div');
    horizontalRoad.className = 'road';
    horizontalRoad.style.width = `${config.citySize}px`;
    horizontalRoad.style.height = '40px';
    horizontalRoad.style.top = `${i * roadSpacing}px`;
    horizontalRoad.style.left = '0px';
    
    // Road line
    const horizontalLine = document.createElement('div');
    horizontalLine.className = 'road-line';
    horizontalLine.style.width = `${config.citySize}px`;
    horizontalLine.style.height = '2px';
    horizontalLine.style.top = '19px';
    horizontalLine.style.left = '0px';
    
    horizontalRoad.appendChild(horizontalLine);
    cityScene.appendChild(horizontalRoad);
    
    // Vertical road
    const verticalRoad = document.createElement('div');
    verticalRoad.className = 'road';
    verticalRoad.style.width = '40px';
    verticalRoad.style.height = `${config.citySize}px`;
    verticalRoad.style.left = `${i * roadSpacing}px`;
    verticalRoad.style.top = '0px';
    
    // Road line
    const verticalLine = document.createElement('div');
    verticalLine.className = 'road-line';
    verticalLine.style.width = '2px';
    verticalLine.style.height = `${config.citySize}px`;
    verticalLine.style.left = '19px';
    verticalLine.style.top = '0px';
    
    verticalRoad.appendChild(verticalLine);
    cityScene.appendChild(verticalRoad);
  }
}

// Create neon signs
function createNeonSign() {
  const neonSign = document.createElement('div');
  neonSign.className = 'neon-sign';
  
  const x = Math.random() * config.citySize - config.citySize / 2;
  const y = Math.random() * config.citySize - config.citySize / 2;
  
  neonSign.style.left = `${x + config.citySize / 2}px`;
  neonSign.style.top = `${y + config.citySize / 2}px`;
  neonSign.style.fontSize = `${Math.random() * 20 + 20}px`;
  
  // Random neon sign text
  const signs = ['CLUB', 'BAR', 'CYBER', 'NEON', 'TECH', 'RETRO', 'XXX', '24/7', 'MOTEL', 'DINER'];
  neonSign.innerText = signs[Math.floor(Math.random() * signs.length)];
  
  // Random neon colors
  const colors = ['#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#ffff00'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  neonSign.style.color = color;
  neonSign.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
  
  cityScene.appendChild(neonSign);
}

// Set up event listeners
function setupEventListeners() {
  // Play button click
  playButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameWorld.classList.remove('hidden');
    backgroundMusic.play();
  });
  
  // Keyboard controls
  document.addEventListener('keydown', e => {
    updateKeyState(e.key, true);
  });
  
  document.addEventListener('keyup', e => {
    updateKeyState(e.key, false);
  });
}

// Update key state based on key press/release
function updateKeyState(key, isPressed) {
  switch(key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      gameState.keys.w = isPressed;
      gameState.keys.up = isPressed;
      break;
    case 'a':
    case 'arrowleft':
      gameState.keys.a = isPressed;
      gameState.keys.left = isPressed;
      break;
    case 's':
    case 'arrowdown':
      gameState.keys.s = isPressed;
      gameState.keys.down = isPressed;
      break;
    case 'd':
    case 'arrowright':
      gameState.keys.d = isPressed;
      gameState.keys.right = isPressed;
      break;
  }
}

// Main game loop
function gameLoop() {
  // Handle player movement
  movePlayer();
  
  // Update game visuals
  updateGameVisuals();
  
  // Continue loop
  requestAnimationFrame(gameLoop);
}

// Move player based on key input
function movePlayer() {
  let dx = 0;
  let dy = 0;
  
  if (gameState.keys.w || gameState.keys.up) dy -= config.moveSpeed;
  if (gameState.keys.s || gameState.keys.down) dy += config.moveSpeed;
  if (gameState.keys.a || gameState.keys.left) dx -= config.moveSpeed;
  if (gameState.keys.d || gameState.keys.right) dx += config.moveSpeed;
  
  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071; // 1/sqrt(2)
    dy *= 0.7071;
  }
  
  // Update player position
  gameState.player.x += dx;
  gameState.player.y += dy;
  
  // Ensure player stays within bounds
  const bound = config.citySize / 2 - 50;
  gameState.player.x = Math.max(-bound, Math.min(bound, gameState.player.x));
  gameState.player.y = Math.max(-bound, Math.min(bound, gameState.player.y));
}

// Update game visuals based on player position
function updateGameVisuals() {
  // Move city scene opposite to player movement to create the illusion of player movement
  cityScene.style.transform = `translate(${-gameState.player.x}px, ${-gameState.player.y}px)`;
}

// Start the game
initGame();

