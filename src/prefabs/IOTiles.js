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
            if(this.curItem) {
                console.log("Pulled partial stack from input");
            } else {
                console.log("Pulled full stack from input");
            }
        } else {
            console.log("No stack to pull");
        }
    }
}

class OutputTile extends IOTile {
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        this.requestedItem = null;
    }

    /**
     * Creates a request for an item stack
     * 
     * @param {Number} stackSize – The number of items requested
     * @param {Number} itemIndex – The index within items.json containing the items specs
     * @returns – The currently requested stack
     */
    createRequest(stackSize, itemIndex) {
        if(this.requestedItem) {
            console.warn("Attempted to create request when an unfulfilled request already exists");
        } else {
            console.assert(stackSize > 0, "Error: Invalid stack size");
            
            let itemConfig = itemSpecs[itemIndex];
            console.assert(itemConfig.maxSize && itemConfig.textureName, "Error: Invalid item config");

            this.requestedItem = new ItemStack(this.scene, {x: this.x, y: this.y}, -stackSize, itemConfig.maxSize, itemConfig.textureName);
            this.requestedItem.setOrigin(0.5);
            this.requestedItem.setDepth(0.5);
        }

        return this.requestedItem;
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
                console.log("Request Fulfilled");
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