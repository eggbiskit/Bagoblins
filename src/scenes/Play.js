class Play extends Phaser.Scene {

    constructor() {
        super("play");
    }

    preload() {
        this.load.image("inventory", "assets/sprites/Inventory.png");
        this.load.image("cursor", "assets/sprites/Cursor.png");
    }

    create() {
        console.log("play");

        this.inventory = new Inventory(this, 4, 5).setOrigin(0.5);
        this.cursor = new Cursor(this.inventory);
        this.cursor.setDepth(1);
        this.cursor.setOrigin(0);
    }
}