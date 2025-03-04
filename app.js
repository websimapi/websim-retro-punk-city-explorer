// Game configuration
const config = {
  moveSpeed: 8,
  acceleration: 0.5,
  deceleration: 0.8,
  maxSpeed: 12,
  citySize: 3000,
  buildingCount: 150,
  neonSignCount: 50,
  streetLampCount: 80,
  beatThreshold: 0.45,
  beatDecay: 0.95
};

// Game state
const gameState = {
  player: {
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0
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
  },
  audio: {
    analyser: null,
    dataArray: null,
    beatDetected: false,
    previousVolume: 0,
    beatTime: 0
  },
  hoveredElement: null
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
  
  // Initialize audio analyzer
  setupAudioAnalyser();
  
  // Add audio visualizer
  createAudioVisualizer();
  
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
  
  // Generate street lamps
  for (let i = 0; i < config.streetLampCount; i++) {
    createStreetLamp();
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

// Create a street lamp
function createStreetLamp() {
  const lamp = document.createElement('div');
  lamp.className = 'street-lamp';
  
  const x = Math.random() * config.citySize - config.citySize / 2;
  const y = Math.random() * config.citySize - config.citySize / 2;
  
  lamp.style.left = `${x + config.citySize / 2}px`;
  lamp.style.top = `${y + config.citySize / 2}px`;
  
  const light = document.createElement('div');
  light.className = 'lamp-light';
  lamp.appendChild(light);
  
  cityScene.appendChild(lamp);
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
  
  // Mouse hover for interactive elements
  document.addEventListener('mousemove', e => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const elements = document.querySelectorAll('.building, .neon-sign');
    let closestElement = null;
    let closestDistance = 100; // Maximum detection distance
    
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(mouseX - centerX, 2) + 
        Math.pow(mouseY - centerY, 2)
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = element;
      }
      
      // Remove glow from non-closest elements
      if (element.classList.contains('hover-glow')) {
        element.classList.remove('hover-glow');
      }
    });
    
    // Add glow to closest element
    if (closestElement) {
      closestElement.classList.add('hover-glow');
      gameState.hoveredElement = closestElement;
    } else {
      gameState.hoveredElement = null;
    }
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

// Set up audio analyzer
function setupAudioAnalyser() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  
  const source = audioContext.createMediaElementSource(backgroundMusic);
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  
  gameState.audio.analyser = analyser;
  gameState.audio.dataArray = new Uint8Array(analyser.frequencyBinCount);
}

// Create audio visualizer
function createAudioVisualizer() {
  const visualizer = document.createElement('div');
  visualizer.id = 'audio-visualizer';
  
  for (let i = 0; i < 32; i++) {
    const bar = document.createElement('div');
    bar.className = 'visualizer-bar';
    visualizer.appendChild(bar);
  }
  
  gameWorld.appendChild(visualizer);
}

// Update audio visualizer and beat detection
function updateAudio() {
  if (!gameState.audio.analyser) return;
  
  gameState.audio.analyser.getByteFrequencyData(gameState.audio.dataArray);
  
  // Update visualizer
  const bars = document.querySelectorAll('.visualizer-bar');
  const binCount = gameState.audio.dataArray.length;
  const step = Math.floor(binCount / bars.length);
  
  let totalVolume = 0;
  
  for (let i = 0; i < bars.length; i++) {
    const value = gameState.audio.dataArray[i * step] / 255;
    bars[i].style.height = `${value * 35}px`;
    totalVolume += value;
  }
  
  // Beat detection
  const averageVolume = totalVolume / bars.length;
  const volumeDelta = averageVolume - gameState.audio.previousVolume;
  
  if (volumeDelta > config.beatThreshold && performance.now() - gameState.audio.beatTime > 300) {
    gameState.audio.beatDetected = true;
    gameState.audio.beatTime = performance.now();
    
    // Apply beat pulse to random elements
    applyBeatPulse();
  } else {
    gameState.audio.beatDetected = false;
  }
  
  gameState.audio.previousVolume = averageVolume * config.beatDecay + 
    gameState.audio.previousVolume * (1 - config.beatDecay);
}

// Apply beat pulse to random elements
function applyBeatPulse() {
  const elements = document.querySelectorAll('.building, .neon-sign, .lamp-light');
  const pulseFactor = Math.random() * 10 + 20;
  
  for (let i = 0; i < pulseFactor; i++) {
    const randomIndex = Math.floor(Math.random() * elements.length);
    const element = elements[randomIndex];
    
    // Add and remove beat pulse
    element.classList.add('beat-pulse');
    setTimeout(() => {
      element.classList.remove('beat-pulse');
    }, 500);
  }
}

// Main game loop
function gameLoop() {
  // Handle player movement
  movePlayer();
  
  // Update audio analysis
  updateAudio();
  
  // Update game visuals
  updateGameVisuals();
  
  // Continue loop
  requestAnimationFrame(gameLoop);
}

// Move player based on key input with smoother momentum-based movement
function movePlayer() {
  const acceleration = config.acceleration;
  const deceleration = config.deceleration;
  const maxSpeed = config.maxSpeed;
  
  // Apply acceleration based on key input
  if (gameState.keys.w || gameState.keys.up) {
    gameState.player.velocityY -= acceleration;
  } else if (gameState.keys.s || gameState.keys.down) {
    gameState.player.velocityY += acceleration;
  } else {
    // Apply deceleration when no keys pressed
    gameState.player.velocityY *= deceleration;
  }
  
  if (gameState.keys.a || gameState.keys.left) {
    gameState.player.velocityX -= acceleration;
  } else if (gameState.keys.d || gameState.keys.right) {
    gameState.player.velocityX += acceleration;
  } else {
    // Apply deceleration when no keys pressed
    gameState.player.velocityX *= deceleration;
  }
  
  // Cap max speed
  const currentSpeed = Math.sqrt(
    gameState.player.velocityX * gameState.player.velocityX + 
    gameState.player.velocityY * gameState.player.velocityY
  );
  
  if (currentSpeed > maxSpeed) {
    const ratio = maxSpeed / currentSpeed;
    gameState.player.velocityX *= ratio;
    gameState.player.velocityY *= ratio;
  }
  
  // Stop completely if speed is very low
  if (Math.abs(gameState.player.velocityX) < 0.1) gameState.player.velocityX = 0;
  if (Math.abs(gameState.player.velocityY) < 0.1) gameState.player.velocityY = 0;
  
  // Update player position
  gameState.player.x += gameState.player.velocityX;
  gameState.player.y += gameState.player.velocityY;
  
  // Ensure player stays within bounds
  const bound = config.citySize / 2 - 50;
  gameState.player.x = Math.max(-bound, Math.min(bound, gameState.player.x));
  gameState.player.y = Math.max(-bound, Math.min(bound, gameState.player.y));
}

// Update game visuals based on player position and audio
function updateGameVisuals() {
  // Player movement effect
  cityScene.style.transform = `translate(${-gameState.player.x}px, ${-gameState.player.y}px)`;
  
  // Rotate player slightly based on movement direction
  const angle = Math.atan2(gameState.player.velocityY, gameState.player.velocityX) * 180 / Math.PI;
  const speed = Math.sqrt(
    gameState.player.velocityX * gameState.player.velocityX + 
    gameState.player.velocityY * gameState.player.velocityY
  );
  
  if (speed > 0.5) {
    player.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  }
  
  // Apply subtle movement to elements based on audio
  if (gameState.audio.dataArray) {
    const bassFrequency = gameState.audio.dataArray[1] / 255;
    const midFrequency = gameState.audio.dataArray[10] / 255;
    
    // Get all buildings and apply subtle transformations
    const buildings = document.querySelectorAll('.building');
    buildings.forEach((building, index) => {
      const offset = (index % 4) * 0.2;
      building.style.transform = `translateY(${bassFrequency * 4 + offset}px)`;
    });
    
    // Get all neon signs and apply subtle transformations
    const neonSigns = document.querySelectorAll('.neon-sign');
    neonSigns.forEach((sign, index) => {
      const offset = (index % 3) * 0.2;
      sign.style.transform = `scale(${1 + midFrequency * 0.1}) rotate(${midFrequency * 2 - offset}deg)`;
    });
  }
}

// Start the game
initGame();