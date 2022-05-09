class Play extends Phaser.Scene {

    constructor() {
        super("play");
    }

    preload() {
        this.load.image("inventory", "assets/sprites/inventory.png");
    }

    create() {
        console.log("play");

        this.inventory = new Inventory(this).setOrigin(0.5);
    }
}