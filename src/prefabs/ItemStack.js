class ItemStack extends Phaser.GameObjects.Sprite {
    constructor(scene, initialPos, stackSize = 1, configIntex) {
        // Getting item info
        let itemConfig = itemSpecs[configIntex];
        console.assert(itemConfig.maxSize && itemConfig.textureName, "Error: Invalid item config index");

        // Adding sprite to scene
        super(scene, initialPos.x, initialPos.y, itemConfig.textureName);
        scene.add.existing(this);
        this.setOrigin(0.5);
        this.setDepth(0.5);

        // Setting parameters
        this.inventory = scene.inventory;
        this.coordinates = {
            row: -1,
            col: -1
        }

        this.name = itemConfig.textureName;
        this.maxSize = itemConfig.maxSize;
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