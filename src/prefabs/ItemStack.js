class ItemStack extends Phaser.GameObjects.Sprite {
    constructor(inventory, stackSize = 1, maxSize = 64, texture) {
        let initialPos = inventory.getSpaceCoords(0, 0);
        super(inventory.scene, initialPos.x, initialPos.y, texture);
        inventory.scene.add.existing(this);

        this.inventory = inventory;
        this.coordinates = {
            row: 0,
            col: 0
        }
        this.inventory.mergeStacks(this, 0, 0);
        this.name = texture;
        this.maxSize = maxSize;
        this.curSize = stackSize;
    }

    setSpot(row, col) {
        let pos = this.inventory.getSpaceCoords(row, col);
        this.coordinates.row = row;
        this.coordinates.col = col;
        this.x = pos.x;
        this.y = pos.y;
    }
}