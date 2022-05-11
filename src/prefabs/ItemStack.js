class ItemStack extends Phaser.GameObjects.Sprite {
    constructor(inventory, stackSize = 1, maxSize = 64, texture) {
        let initialPos = inventory.getSpaceCoords(0, 0);
        super(inventory.scene, initialPos.x, initialPos.y, texture);
        
        inventory.scene.add.existing(this);
        this.maxSize = maxSize;
        this.curSize = stackSize;
    }
}