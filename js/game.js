// Game state
let gameState = {
    needs: {
        hunger: 50,
        thirst: 50,
        energy: 50,
        hygiene: 50,
        happiness: 50
    },
    dayCount: 1,
    events: []
};

// Create Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'game-container',
    backgroundColor: '#a8e6cf',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize the game
let game = new Phaser.Game(config);
let puppy, walkPath, cleanSpots;
let gameActive = true;
let lastUpdateTime = Date.now();
let needsDecayRate = 0.05; // How fast needs decay per second
let inMinigame = false;

// Preload game assets
function preload() {
    // Try to load the puppy sprite, with a fallback option
    this.load.image('puppy', 'assets/puppy.png');
    // Fallback if image fails to load
    this.load.image('puppy_fallback', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkJFMUVFNTg5ODM4MTFFQTg0MkZDQUE4NjlCQkJGMzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkJFMUVFNTk5ODM4MTFFQTg0MkZDQUE4NjlCQkJGMzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCQkUxRUU1Njk4MzgxMUVBODQyRkNBQTg2OUJCQkYzOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCQkUxRUU1Nzk4MzgxMUVBODQyRkNBQTg2OUJCQkYzOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqfCcbAAAAJjSURBVHjaYvz//z/DQAImhgEGow4YdQDjEHDAF0ZGxqNAaju6GBwO+I+ktgEqHgCVP4jPAYvQzMsA4l5kPhJ4AYgT0OQYgTgUSe4+VK8DE4oFvEAcA8SbcVjUBzUzBogdgFgVSY0bVMwRqscMiA8TsoBQPNdBHQUDblBXHwfiFiA+iCR3GYi9gHgnEIcAsReUvRvJsodQC/DlAyEgfgzEeihmOEDFEBkYPUsagZgDiOcD8UOoQ7yR5EyB+AOU/QCIF0DF+aC+wRcGFIHYEoj9keT8oWJiQNwFxEpAbA7Ey6DiAtgCmVgH6APxJSB+CcRTgfgMEBsBsTA0I4pA9WlA2RegYupEOkAUGqASaME1Dci+DEQNSHIa0IJLlMgwMA66aOdHE7oBxL9Q+DpUrBYtvmnDw+ArkjgXErsPqs8BSWwjENshsbORHDADSZIRKmaCR60eNDB/AbEdmgPOA3EYEOdAE13zQDrAGUk8k8jAYmaA1gOGSA7YB8SZA5mIDpLI7qaB+aegqWE51AEnB9IB4Whi76D0bSLUZyDJfYfSYVAHTMOI6X4G/AAU8NNBjnk80GWV81A+4XKgBYjfQRt5hLrgBlSuBYhnAXEFNC1tI6JIeo9Wj7ihOXI2tAVmDFX/mYjeFBMlsAShncFfSFnhHxQzkRg++NoD66EOFQfir9A66hsQpwPxXSqE5UdoO3AeNJ4/Ae0A0Lz5lMQiWReoByUgPdDScw0QP6NFIjpNaiJiAWoueiJihcrRLBFpAHERUpHM8GmICyVqAiVkK3QwPQnJiP8Yho7mDw8cDQMGRh0w6oABdwAIMABEEEe8/3cOzAAAAABJRU5ErkJggg==');
    
    // Load background elements
    this.load.image('grass', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjI2QkJCNjA5ODM4MTFFQTg0MkZDQUE4NjlCQkJGMzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjI2QkJCNjE5ODM4MTFFQTg0MkZDQUE4NjlCQkJGMzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MjZCQkI1RTk4MzgxMUVBODQyRkNBQTg2OUJCQkYzOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MjZCQkI1Rjk4MzgxMUVBODQyRkNBQTg2OUJCQkYzOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnmPuVAAAABUSURBVHjaYmRgYPgPBAxQgI25AMYHsUH0fxDNCJMEAZg4XAGIDVMAUgRWCKIZIKoZQE5DV4BsM0wzigPQFTMwMKACdAU4wajCUYXUU8gEEGAANDQSxh09idcAAAAASUVORK5CYII=');
    
    // Load mini-game assets
    this.load.image('bone', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAfwAAAH8BY0szDQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAB3SURBVDiNY2AYTICRgQHaXXWGgYHhNAMDgwoVzN7OwMAwn5GBgeE4AwODMgMDw38qmK/CwMBwjJEBElD/GRgY5KlouAoDAwNDAwMDw3xkAQ0KXcPAwMDQwABlLKfQcJgal5HUfExkMQYGBobzeLAwUGg4epRRGQAA+pUZQ1nRKFUAAAAASUVORK5CYII=');
    this.load.image('mess', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAfwAAAH8BY0szDQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABtSURBVDiNY2RgYHBnYGDQZ2BgYGZAAx8YGBh2MzAw/EWT02dgYNgANRgXuM7AwJDEgAD/GRgY7jIwMMzA0LGagYEhF4i9kQTvQzEu8B9KM2JTwMTAwDCLgYFBncgAckc1DwyMupBKgGgXDhQAAG6nG/9DZaLvAAAAAElFTkSuQmCC');
    this.load.image('mop', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAfwAAAH8BY0szDQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABNSURBVDiNY2AYGOAvAwODKpqYPgMDw3YKzH/PwMBwm4GB4T4DA4MCAwPDfwrNV4FaUMDAwLD+PwPDckoMh5m/nhFNkBLDR8FIccGgBwDb+wn/22KPnQAAAABJRU5ErkJggg==');
}

// Create game elements
function create() {
    // Create background
    for (let i = 0; i < 80; i++) {
        for (let j = 0; j < 40; j++) {
            this.add.image(i * 10, j * 10, 'grass').setOrigin(0, 0).setAlpha(0.5);
        }
    }
    
    try {
        // Try to create the puppy sprite with the main image
        puppy = this.add.sprite(400, 200, 'puppy').setScale(0.5);
    } catch (e) {
        // If that fails, use the fallback
        console.warn('Failed to load puppy.png, using fallback:', e);
        puppy = this.add.sprite(400, 200, 'puppy_fallback').setScale(2);
    }
    
    // Add some animation to puppy
    this.tweens.add({
        targets: puppy,
        y: puppy.y - 10,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    
    // Initialize needs display
    updateNeedsDisplay();
}

// Update game state
function update() {
    if (!gameActive || inMinigame) {
        return;
    }
    
    // Calculate time passed since last update
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTime) / 1000; // Convert to seconds
    lastUpdateTime = currentTime;
    
    // Decrease needs over time
    if (deltaTime > 0) {
        gameState.needs.hunger += needsDecayRate * deltaTime;
        gameState.needs.thirst += needsDecayRate * deltaTime;
        gameState.needs.energy -= needsDecayRate * deltaTime;
        gameState.needs.hygiene -= needsDecayRate * 0.5 * deltaTime;
        gameState.needs.happiness -= needsDecayRate * 0.8 * deltaTime;
        
        // Ensure needs stay within bounds
        Object.keys(gameState.needs).forEach(need => {
            gameState.needs[need] = Math.max(0, Math.min(100, gameState.needs[need]));
        });
        
        // Update needs display
        updateNeedsDisplay();
    }
}

// Function to update the needs display bars
function updateNeedsDisplay() {
    updateBar('hunger-bar', gameState.needs.hunger);
    updateBar('thirst-bar', gameState.needs.thirst);
    updateBar('energy-bar', gameState.needs.energy);
    updateBar('hygiene-bar', gameState.needs.hygiene);
    updateBar('happiness-bar', gameState.needs.happiness);
}

// Helper function to update a single need bar
function updateBar(id, value) {
    const bar = document.getElementById(id);
    if (bar) {
        // Set the width of the bar based on the value (0-100%)
        bar.style.width = `${value}%`;
        
        // Change color based on value
        if (value < 30) {
            bar.style.backgroundColor = '#e74c3c'; // Red for low values
        } else if (value < 60) {
            bar.style.backgroundColor = '#f39c12'; // Orange for medium values
        } else {
            bar.style.backgroundColor = '#2ecc71'; // Green for high values
        }
    }
}

// Function to handle feeding the puppy
function feed(params = {}) {
    if (!params.type) return;
    
    // Update needs based on food type
    gameState.needs.hunger = Math.max(0, gameState.needs.hunger + (params.hunger || 0));
    gameState.needs.thirst = Math.max(0, gameState.needs.thirst + (params.thirst || 0));
    gameState.needs.happiness = Math.min(100, gameState.needs.happiness + (params.happiness || 0));
    
    // Add event to log
    gameState.events.push(`Fed puppy with ${params.type}`);
    
    // Animation for feeding
    if (puppy) {
        game.scene.scenes[0].tweens.add({
            targets: puppy,
            scaleX: puppy.scaleX * 1.2,
            scaleY: puppy.scaleY * 1.2,
            duration: 300,
            yoyo: true,
            repeat: 1
        });
    }
    
    // Update needs display
    updateNeedsDisplay();
}

// Function to give water to the puppy
function giveWater() {
    gameState.needs.thirst = Math.max(0, gameState.needs.thirst - 40);
    gameState.events.push('Gave water to puppy');
    updateNeedsDisplay();
}

// Function to start the walk mini-game
function startWalk() {
    inMinigame = true;
    
    // Get the scene
    const scene = game.scene.scenes[0];
    
    // Store the original puppy position
    const originalX = puppy.x;
    const originalY = puppy.y;
    
    // Clear the scene for the mini-game
    puppy.setVisible(false);
    
    // Create a new puppy for the mini-game
    const walkPuppy = scene.add.sprite(100, 200, puppy.texture.key).setScale(0.5);
    
    // Add text instructions
    const instructions = scene.add.text(400, 50, 'Collect bones while walking your puppy!', {
        fontSize: '18px',
        fill: '#333',
        align: 'center'
    }).setOrigin(0.5);
    
    // Add path
    const pathGraphics = scene.add.graphics();
    pathGraphics.lineStyle(50, 0x8B4513, 0.3);
    pathGraphics.beginPath();
    pathGraphics.moveTo(50, 200);
    pathGraphics.lineTo(750, 200);
    pathGraphics.strokePath();
    
    // Add bones to collect
    const bones = [];
    for (let i = 0; i < 5; i++) {
        const bone = scene.add.image(200 + i * 100, 200, 'bone').setScale(1.5);
        bones.push(bone);
    }
    
    // Keep track of collected bones
    let collectedBones = 0;
    const scoreText = scene.add.text(700, 50, 'Bones: 0/5', { 
        fontSize: '16px',
        fill: '#333'
    });
    
    // Add controls
    const cursors = scene.input.keyboard.createCursorKeys();
    
    // Add timer
    let timeLeft = 30;
    const timerText = scene.add.text(100, 50, `Time: ${timeLeft}s`, { 
        fontSize: '16px',
        fill: '#333'
    });
    
    // Timer event
    const timerEvent = scene.time.addEvent({
        delay: 1000,
        callback: () => {
            timeLeft--;
            timerText.setText(`Time: ${timeLeft}s`);
            
            if (timeLeft <= 0) {
                endWalk();
            }
        },
        loop: true
    });
    
    // Update function for walk mini-game
    scene.walkUpdate = function() {
        // Move puppy with arrow keys
        if (cursors.left.isDown) {
            walkPuppy.x -= 3;
            walkPuppy.flipX = true;
        } else if (cursors.right.isDown) {
            walkPuppy.x += 3;
            walkPuppy.flipX = false;
        }
        
        // Keep puppy within bounds
        walkPuppy.x = Phaser.Math.Clamp(walkPuppy.x, 50, 750);
        
        // Check for bone collection
        bones.forEach((bone, index) => {
            if (bone.visible && Phaser.Math.Distance.Between(walkPuppy.x, walkPuppy.y, bone.x, bone.y) < 30) {
                bone.setVisible(false);
                collectedBones++;
                scoreText.setText(`Bones: ${collectedBones}/5`);
                
                if (collectedBones >= 5) {
                    endWalk();
                }
            }
        });
    };
    
    // Override the update function temporarily
    const originalUpdate = scene.update;
    scene.update = scene.walkUpdate;
    
    // Function to end the walk mini-game
    function endWalk() {
        // Cleanup
        timerEvent.remove();
        walkPuppy.destroy();
        pathGraphics.destroy();
        instructions.destroy();
        scoreText.destroy();
        timerText.destroy();
        bones.forEach(bone => bone.destroy());
        
        // Restore original scene
        puppy.setVisible(true);
        scene.update = originalUpdate;
        inMinigame = false;
        
        // Update puppy needs based on walk performance
        gameState.needs.energy = Math.max(10, gameState.needs.energy - 20);
        gameState.needs.happiness = Math.min(100, gameState.needs.happiness + 10 + (collectedBones * 5));
        
        // Log event
        gameState.events.push(`Took puppy for a walk and collected ${collectedBones} bones`);
        
        updateNeedsDisplay();
    }
}

// Function to start the cleaning mini-game
function startClean() {
    inMinigame = true;
    
    // Get the scene
    const scene = game.scene.scenes[0];
    
    // Store the original puppy position
    puppy.setVisible(false);
    
    // Add text instructions
    const instructions = scene.add.text(400, 50, 'Clean up all the messes before time runs out!', {
        fontSize: '18px',
        fill: '#333',
        align: 'center'
    }).setOrigin(0.5);
    
    // Create messes to clean
    const messes = [];
    for (let i = 0; i < 8; i++) {
        const x = 100 + Math.random() * 600;
        const y = 100 + Math.random() * 200;
        const mess = scene.add.image(x, y, 'mess').setScale(2);
        messes.push(mess);
    }
    
    // Create mop (cursor)
    const mop = scene.add.image(400, 200, 'mop').setScale(2);
    scene.input.on('pointermove', (pointer) => {
        mop.x = pointer.x;
        mop.y = pointer.y;
    });
    
    // Keep track of cleaned messes
    let cleanedMesses = 0;
    const scoreText = scene.add.text(700, 50, 'Cleaned: 0/8', { 
        fontSize: '16px',
        fill: '#333'
    });
    
    // Add timer
    let timeLeft = 30;
    const timerText = scene.add.text(100, 50, `Time: ${timeLeft}s`, { 
        fontSize: '16px',
        fill: '#333'
    });
    
    // Timer event
    const timerEvent = scene.time.addEvent({
        delay: 1000,
        callback: () => {
            timeLeft--;
            timerText.setText(`Time: ${timeLeft}s`);
            
            if (timeLeft <= 0) {
                endClean();
            }
        },
        loop: true
    });
    
    // Click to clean messes
    scene.input.on('pointerdown', () => {
        messes.forEach((mess, index) => {
            if (mess.visible && Phaser.Math.Distance.Between(mop.x, mop.y, mess.x, mess.y) < 40) {
                mess.setVisible(false);
                cleanedMesses++;
                scoreText.setText(`Cleaned: ${cleanedMesses}/8`);
                
                if (cleanedMesses >= 8) {
                    endClean();
                }
            }
        });
    });
    
    // Function to end the cleaning mini-game
    function endClean() {
        // Cleanup
        timerEvent.remove();
        mop.destroy();
        instructions.destroy();
        scoreText.destroy();
        timerText.destroy();
        messes.forEach(mess => mess.destroy());
        
        // Remove event listeners
        scene.input.off('pointermove');
        scene.input.off('pointerdown');
        
        // Restore original scene
        puppy.setVisible(true);
        inMinigame = false;
        
        // Update puppy needs based on cleaning performance
        gameState.needs.hygiene = Math.min(100, gameState.needs.hygiene + 20 + (cleanedMesses * 5));
        
        // Log event
        gameState.events.push(`Cleaned ${cleanedMesses} messes`);
        
        updateNeedsDisplay();
    }
}

// Function to skip cleaning
function skipClean() {
    gameState.needs.hygiene = Math.max(0, gameState.needs.hygiene - 30);
    gameState.needs.happiness = Math.max(0, gameState.needs.happiness - 15);
    gameState.events.push('Skipped cleaning');
    updateNeedsDisplay();
}

// Function to handle travel arrangements
function travel(params = {}) {
    if (!params.type) return;
    
    // Update needs based on travel arrangement type
    switch (params.type) {
        case 'sitter':
            gameState.needs.happiness = Math.max(10, gameState.needs.happiness - 10);
            gameState.events.push('Used pet sitter during travel');
            break;
        case 'boarding':
            gameState.needs.happiness = Math.max(0, gameState.needs.happiness - 20);
            gameState.events.push('Used boarding service during travel');
            break;
        case 'friend':
            gameState.needs.happiness = Math.max(0, gameState.needs.happiness - 30);
            gameState.needs.hygiene = Math.max(0, gameState.needs.hygiene - 20);
            gameState.events.push('Left puppy with a friend during travel');
            break;
    }
    
    updateNeedsDisplay();
}

// Function to show summary of the day
function showSummary() {
    // Calculate overall score based on puppy needs
    const needsValues = Object.values(gameState.needs);
    const averageNeeds = needsValues.reduce((acc, val) => acc + val, 0) / needsValues.length;
    let grade = '';
    
    if (averageNeeds >= 80) grade = 'A';
    else if (averageNeeds >= 70) grade = 'B';
    else if (averageNeeds >= 60) grade = 'C';
    else if (averageNeeds >= 50) grade = 'D';
    else grade = 'F';
    
    // Create text summary in the game
    const scene = game.scene.scenes[0];
    
    const summaryBg = scene.add.rectangle(400, 200, 700, 300, 0xffffff, 0.9);
    summaryBg.setStrokeStyle(2, 0x000000);
    
    const titleText = scene.add.text(400, 100, `Day ${gameState.dayCount} Summary`, {
        fontSize: '24px',
        fill: '#333',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const scoreText = scene.add.text(400, 140, `Overall Care Grade: ${grade}`, {
        fontSize: '20px',
        fill: grade === 'A' ? '#2ecc71' : (grade === 'F' ? '#e74c3c' : '#f39c12'),
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const eventsTitle = scene.add.text(400, 180, 'Day Highlights:', {
        fontSize: '18px',
        fill: '#333',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Show last 5 events
    const recentEvents = gameState.events.slice(-5);
    recentEvents.forEach((event, index) => {
        scene.add.text(400, 210 + (index * 25), `• ${event}`, {
            fontSize: '16px',
            fill: '#333'
        }).setOrigin(0.5, 0);
    });
    
    // Add button to continue
    const continueButton = scene.add.text(400, 350, 'Continue to next day', {
        fontSize: '18px',
        fill: '#4a6fa5',
        backgroundColor: '#ffffff',
        padding: {
            x: 20,
            y: 10
        }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    continueButton.on('pointerover', () => {
        continueButton.setStyle({ fill: '#ffffff', backgroundColor: '#4a6fa5' });
    });
    
    continueButton.on('pointerout', () => {
        continueButton.setStyle({ fill: '#4a6fa5', backgroundColor: '#ffffff' });
    });
    
    continueButton.on('pointerdown', () => {
        // Clean up
        summaryBg.destroy();
        titleText.destroy();
        scoreText.destroy();
        eventsTitle.destroy();
        continueButton.destroy();
        
        scene.children.list.forEach(child => {
            if (child.type === 'Text' && child.text.includes('•')) {
                child.destroy();
            }
        });
        
        // Reset for next day
        resetDay();
    });
}

// Function to reset for a new day
function resetDay() {
    // Increment day count
    gameState.dayCount++;
    
    // Reset puppy needs to moderate levels
    gameState.needs = {
        hunger: 50,
        thirst: 50,
        energy: 70,
        hygiene: 70,
        happiness: 60
    };
    
    // Clear events
    gameState.events = [];
    
    // Update display
    updateNeedsDisplay();
    
    // Reset conversation to beginning
    currentConversation = 'intro';
    displayConversation();
}
