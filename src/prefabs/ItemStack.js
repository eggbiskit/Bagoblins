class ItemStack extends Phaser.GameObjects.Sprite {
    constructor(scene, initialPos, stackSize = 1, maxSize = 64, texture) {
        super(scene, initialPos.x, initialPos.y, texture);
        scene.add.existing(this);

        this.inventory = scene.inventory;
        this.coordinates = {
            row: -1,
            col: -1
        }

        this.name = texture;
        this.maxSize = maxSize;
        this.curSize = stackSize;

        if(stackSize < 0) {
            // Stack is a request
            this.setAlpha(0.5);
        }
    }

    setSpot(row, col) {
        let pos = this.inventory.getSpaceCoords(row, col);
        this.coordinates.row = row;
        this.coordinates.col = col;
        this.x = pos.x;
        this.y = pos.y;
    }
}