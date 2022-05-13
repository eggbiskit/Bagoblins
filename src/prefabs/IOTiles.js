class IOTile extends Phaser.GameObjects.Sprite {
    constructor(scene, posX, posY) {
        super(scene, posX, posY, "tile");
        scene.add.existing(this);
        this.scene = scene;
    }
}

class InputTile extends IOTile {
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        this.curItem = null;
    }

    pull(cursor) {
        if(this.curItem) {
            this.curItem = this.scene.inventory.mergeStacks(this.curItem, cursor.coordinates.y, cursor.coordinates.x, true);
        }
    }
}

class OutputTile extends IOTile {
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        this.requestedItem = null;
    }

    /**
     * Pushes an item in the inventory to the output
     * 
     * @param {ItemStack} incomingStack – The stack currently being pushed
     * @returns – The remainder of the outgoing stack following the push (or null for an empty stack)
     */
    push(incomingStack) {
        if(!this.requestedItem) {
            console.log("No item requested");
            return incomingStack;
        }

        if(incomingStack.name == this.requestedItem.name) {
            if(incomingStack.curSize >= this.requestedItem.curSize) {
                incomingStack.curSize += this.requestedItem.curSize;
                this.requestedItem.curSize = 0;
            } else {
                this.requestedItem.curSize += incomingStack.curSize;
                incomingStack.curSize = 0
            }

            // Check for empty stacks
            if(this.requestedItem.curSize == 0) {
                this.requestedItem.setAlpha(1);
            }
            if(incomingStack.curSize == 0) {
                return null;
            }
        } else {
            console.log("Wrong item was attempted to be pushed");
        }
    }
}