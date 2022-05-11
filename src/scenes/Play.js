class Play extends Phaser.Scene {

    constructor() {
        super("play");
    }

    create() {
        console.log("play");

        this.inventory = new Inventory(this, 4, 5).setOrigin(0.5);
        this.cursor = new Cursor(this.inventory);
        this.cursor.setDepth(1);
        this.cursor.setOrigin(0);
    }
}