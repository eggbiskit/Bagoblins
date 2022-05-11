class Cursor extends Phaser.GameObjects.Sprite {
    constructor(inventory) {
        super(inventory.scene, inventory.x - inventory.displayWidth / 2, inventory.y - inventory.displayHeight / 2, "cursor");
        inventory.scene.add.existing(this);
    }
}