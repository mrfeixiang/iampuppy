const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let puppy, needs = { hunger: 50, thirst: 50, energy: 50, hygiene: 50, happiness: 50 };

function preload() {
    this.load.image('puppy', 'assets/puppy.png'); // Add your puppy image
}

function create() {
    puppy = this.add.sprite(400, 200, 'puppy');
    displayConversation(); // Start conversation
}

function update() {
    // Update needs every few seconds
    needs.hunger += 0.01;
    needs.energy -= 0.01;
    // Add UI to show needs (e.g., text or bars)
}
