class Inventory extends Phaser.GameObjects.Sprite {
    constructor(scene, cols, rows) {
        // Sprite Setup
        super(scene, game.config.width / 2, game.config.height / 2, "inventory");
        scene.add.existing(this);

        // Array Setup
        this.contents = new Array();
        this.arrBounds = {
            cols: cols,
            rows: rows
        }

        // Space Setup
        console.assert(this.displayWidth / rows === this.displayHeight / cols, "Error: Inventory is not made of squares");
        this.slotSize = this.displayWidth / rows;
    }
}