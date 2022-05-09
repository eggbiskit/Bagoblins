class Inventory extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, game.config.width / 2, game.config.height / 2, "inventory");
        scene.add.existing(this);
    }
}