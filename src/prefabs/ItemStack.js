class ItemStack extends Phaser.GameObjects.Sprite {
    constructor(scene, initialPos, stackSize = 1, configIntex) {
        // Getting item info
        let itemConfig = itemSpecs[configIntex];
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
        this.textOffset = this.width / gameSettings.offsetDenoms.itemText;
        let txtCfg = gameSettings.textConfigs.item;
        this.stackText = scene.add.bitmapText(this.textOffset + this.x, this.textOffset + this.y, txtCfg.font, Math.abs(this.curSize), txtCfg.size, txtCfg.align);
        this.stackText.setDepth(12);
        this.stackText.setOrigin(0.5, 0.375);
    }

    deconstructor() {
        this.stackText.destroy();
        this.destroy();
    }

    setSpot(row, col) {
        let pos = this.inventory.getSpaceCoords(row, col);
        this.coordinates.row = row;
        this.coordinates.col = col;
        this.x = pos.x;
        this.y = pos.y;
        this.positionText();
    }

    positionText() {
        this.stackText.x = this.x + this.textOffset;
        this.stackText.y = this.y + this.textOffset;
    }

    updateText() {
        this.stackText.text = Math.abs(this.curSize);
    }
}