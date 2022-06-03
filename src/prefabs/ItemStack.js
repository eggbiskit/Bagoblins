class ItemStack extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene – Scene the stack is tied to
     * @param {Object} initialPos – Starting position of the item
     * @param {Number} initialPos.x – Starting X Position
     * @param {Number} initialPos.y – Starting Y position
     * @param {Number} stackSize – The number of items starting in the stack. Must be less than or equal to the maximum stack size for the item
     * @param {Number} configIndex – The index in {@link itemConfig} of the item
     */
    constructor(scene, initialPos, stackSize = 1, configIndex) {
        // Getting item info
        let itemConfig = itemSpecs[configIndex];
        console.assert(itemConfig.maxSize && itemConfig.textureName, "Error: Invalid item config index");
        if(itemConfig.maxSize < stackSize) {
            console.error("Error: Invalid Stack Size");
            stackSize = itemConfig.maxSize;
        }

        // Adding sprite to scene
        super(scene, initialPos.x, initialPos.y, itemConfig.textureName);
        scene.add.existing(this);
        this.setOrigin(0.5);
        this.setDepth(gameSettings.depths.items);

        // Setting parameters
        this.inventory = scene.inventory;
        this.coordinates = {
            row: -1,
            col: -1
        }

        this.name = itemConfig.textureName;
        this.maxSize = itemConfig.maxSize;
        this.curSize = stackSize;

        if (stackSize < 0) {
            // Stack is a request
            this.setAlpha(0.5);
        }

        // Adding stack text
        this.textOffset = {
            x: this.width / 2 - this.width / gameSettings.offsetDenoms.itemTextX,
            y: this.height / 2 - this.height / gameSettings.offsetDenoms.itemTextY
        };
        let txtCfg = gameSettings.textConfigs.item;
        this.stackText = scene.add.bitmapText(this.textOffset.x + this.x, this.textOffset.y + this.y, txtCfg.font, Math.abs(this.curSize), txtCfg.size, txtCfg.align);
        this.stackText.setDepth(12);
        this.stackText.setOrigin(0.5, 0.375);
    }

    /**
     * Destroys all components of the item
     */
    deconstructor() {
        this.stackText.destroy();
        this.destroy();
    }

    /**
     * Sets the position of the item to the provided inventory space
     * 
     * @param {Number} row – Row in inventory to move the item
     * @param {Number} col – Column in inventory to move the item
     */
    setSpot(row, col) {
        let pos = this.inventory.getSpaceCoords(row, col);
        this.coordinates.row = row;
        this.coordinates.col = col;
        this.x = pos.x;
        this.y = pos.y;
        this.positionText();
    }

    /**
     * Re-positions the stack text relative to the item
     */
    positionText() {
        this.stackText.x = this.x + this.textOffset.x;
        this.stackText.y = this.y + this.textOffset.y;
    }

    /**
     * Updates the stacktext to reflect the current stack size
     */
    updateText() {
        this.stackText.text = Math.abs(this.curSize);
    }
}