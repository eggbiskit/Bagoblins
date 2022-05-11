class Cursor extends Phaser.GameObjects.Sprite {
    constructor(inventory) {
        // Sprite Setup
        super(inventory.scene, inventory.x - inventory.displayWidth / 2, inventory.y - inventory.displayHeight / 2, "cursor");
        inventory.scene.add.existing(this);

        // Instance Variable Setup
        this.inventory = inventory;
        this.coordinates = {
            x: 1,
            y: 1
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
        let increment = (isPositive) ? 1 : -1;
        if(isVertical) {
            if((this.coordinates.y == 1 && !isPositive) || (this.coordinates.y == this.inventory.arrBounds.rows && isPositive)) {
                // Placeholder for tweens later maybe
            } else {
                this.y += posChange;
                this.coordinates.y += increment;
            }
        } else {
            if((this.coordinates.x == 1 && !isPositive) || (this.coordinates.x == this.inventory.arrBounds.cols && isPositive)) {
                // Placeholder for tweens later maybe
            } else {
                this.x += posChange;
                this.coordinates.x += increment;
            }
        }
    }
}