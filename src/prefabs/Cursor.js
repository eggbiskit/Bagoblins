class Cursor extends Phaser.GameObjects.Sprite {
    constructor(inventory) {
        let initialPos = inventory.getSpaceCoords(0, 0);
        // Sprite Setup
        super(inventory.scene, initialPos.x, initialPos.y,'play_atlas', 'cursor');
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
     * @returns Whether or not the cursor moved
     */
    move(isVertical, isPositive) {
        if (!this.scene.endOGame) {
            let increment = (isPositive) ? 1 : -1;
            let axisTerms = (isVertical) ? { axis: "y", tableJust: "rows" } : { axis: "x", tableJust: "cols" };
            if ((this.coordinates[axisTerms.axis] == 0 && !isPositive)
                || (this.coordinates[axisTerms.axis] == this.inventory.arrBounds[axisTerms.tableJust] - 1 && isPositive)) {
                // Placeholder for tweens later maybe
                return false;
            } else {
                this.coordinates[axisTerms.axis] += increment;
                let newCoords = this.inventory.getSpaceCoords(this.coordinates.y, this.coordinates.x)[axisTerms.axis];
                if(this.heldStack) {
                    let stack = this.heldStack;
                    this.scene.addTween([this, stack], "cursorMove", {[axisTerms.axis]: newCoords, onUpdate: () => {stack.positionText()}});
                } else {
                    this.scene.addTween(this, "cursorMove", {[axisTerms.axis]: newCoords});
                }
            }
            return true;
        }
        return false;
    }

    pickUpStack() {
        this.heldStack = this.inventory.getStack(this.coordinates.y, this.coordinates.x);
        if (this.heldStack) {
            this.heldStack.setDepth(gameSettings.depths.heldItems);
            console.log("Picked up Stack");
            return true;
        } else {
            console.log("No Stack to Pick Up");
            this.scene.wrongMove();
            return false;
        }
    }

    dropStack() {
        this.heldStack.setDepth(gameSettings.depths.items);
        this.heldStack = this.inventory.mergeStacks(this.heldStack, this.coordinates.y, this.coordinates.x);
        if (this.heldStack) {
            this.heldStack.setDepth(gameSettings.depths.heldItems);
            console.log("Did not drop stack");
        } else {
            console.log("Dropped Stack");
        }
    }
}