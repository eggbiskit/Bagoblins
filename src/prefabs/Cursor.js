class Cursor extends Phaser.GameObjects.Sprite {
    constructor(inventory) {
        // Sprite Setup
        super(inventory.scene, inventory.x - inventory.displayWidth / 2, inventory.y - inventory.displayHeight / 2, "cursor");
        inventory.scene.add.existing(this);

        // Instance Variable Setup
        this.inventory = inventory;
        this.coordinates = {
            x: 0,
            y: 0
        }
    }

    /**
     * Function that moves the cursor one tile in any direction
     * 
     * @param {bool} isVertical – Whether or not the movement is vertical
     * @param {bool} isPositive – Whether or not the movement is in a positive direction (down or right)
     */
    move(isVertical, isPositive) {
        let posChange = (isPositive) ? this.inventory.slotSize : -this.inventory.slotSize;
        if(isVertical) {
            this.y += posChange;
        } else {
            this.x += posChange;
        }
    }
}