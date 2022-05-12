class ItemStack extends Phaser.GameObjects.Sprite {
    constructor(scene, stackSize = 1, maxSize = 64, texture) {
        let initialPos = scene.inventory.getSpaceCoords(0, 0);
        super(scene, initialPos.x, initialPos.y, texture);
        scene.add.existing(this);

        this.inventory = scene.inventory;
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