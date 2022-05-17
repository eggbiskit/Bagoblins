class Cursor extends Phaser.GameObjects.Sprite {
    constructor(inventory) {
        let initialPos = inventory.getSpaceCoords(0, 0);
        // Sprite Setup
        super(inventory.scene, initialPos.x, initialPos.y, "cursor");
        inventory.scene.add.existing(this);
        this.setDepth(gameSettings.depths.cursor);
        this.setOrigin(0.5);

        // Instance Variable Setup
        this.inventory = inventory;
        this.coordinates = {
            x: 0,
            y: 0
        }
        this.heldStack = null;
    }

    /**
     * Function that moves the cursor one tile in any direction
     * 
     * @param {Boolean} isVertical – Whether or not the movement is vertical
     * @param {Boolean} isPositive – Whether or not the movement is in a positive direction (down or right)
     */
    move(isVertical, isPositive) {
        let posChange = (isPositive) ? this.inventory.slotSize : -this.inventory.slotSize;
        let increment = (isPositive) ? 1 : -1;
        let axisTerms = (isVertical) ? { axis: "y", tableJust: "rows" } : { axis: "x", tableJust: "cols" };
        if ((this.coordinates[axisTerms.axis] == 0 && !isPositive)
            || (this.coordinates[axisTerms.axis] == this.inventory.arrBounds[axisTerms.tableJust] - 1 && isPositive)) {
            // Placeholder for tweens later maybe
        } else {
            this[axisTerms.axis] += posChange;
            this.coordinates[axisTerms.axis] += increment;
        }

        // Moving held stack
        if(this.heldStack) {
            this.heldStack.x = this.x;
            this.heldStack.y = this.y;
        }
    }

    pickUpStack() {
        this.heldStack = this.inventory.getStack(this.coordinates.y, this.coordinates.x);
        if(this.heldStack) {
            this.heldStack.setDepth(gameSettings.depths.heldItems);
            console.log("Picked up Stack");
            return true;
        } else {
            console.log("No Stack to Pick Up");
            return false;
        }
    }

    dropStack() {
        this.heldStack.setDepth(gameSettings.depths.items);
        this.heldStack = this.inventory.mergeStacks(this.heldStack, this.coordinates.y, this.coordinates.x);
        if(this.heldStack) {
            this.heldStack.setDepth(gameSettings.depths.heldItems);
            console.log("Did not drop stack");
        } else {
            console.log("Dropped Stack");
        }
    }
}