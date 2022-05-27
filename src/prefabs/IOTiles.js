class IOTile extends Phaser.GameObjects.Sprite {
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        scene.add.existing(this);
        this.setOrigin(0.5);
        this.setDepth(gameSettings.depths.UI);
        this.scene = scene;
    }
}

class InputTile extends IOTile {
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        this.curItem = null;
    }

    pull(cursor) {
        if (this.curItem) {
            let startingSize = this.curItem.curSize;
            let name = this.curItem.name;
            this.curItem = this.scene.inventory.mergeStacks(this.curItem, cursor.coordinates.y, cursor.coordinates.x, true);
            if (this.curItem) {
                this.scene.inventory.itemCount[name] += this.curItem.curSize;
                console.log("Pulled partial or no stack from input");
            } else {
                this.scene.inventory.itemCount[name] += startingSize;
                console.log("Pulled full stack from input");
            }
        } else {
            console.log("No stack to pull");
        }
    }

    /**
     * Creates a new item stack
     * 
     * @param {Number} stackSize – The number of items created
     * @param {Number} itemIndex – The index within items.jzon containing the item specs
     * @returns – The item currently in the input space
     */
    createItem(stackSize, itemIndex) {
        if (this.curItem) {
            console.warn("Attempted to create an item while the input has not been emptied");
        } else {
            console.assert(stackSize > 0, "Error: Invalid stack size");

            this.curItem = new ItemStack(this.scene, { x: this.x, y: this.y }, stackSize, itemIndex);
        }

        return this.curItem;
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
        if (this.requestedItem) {
            console.warn("Attempted to create request when an unfulfilled request already exists");
        } else {
            console.assert(stackSize > 0, "Error: Invalid stack size");

            this.requestedItem = new ItemStack(this.scene, { x: this.x, y: this.y }, -stackSize, itemIndex);
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
        if (!this.requestedItem) {
            console.log("No item requested");
            return incomingStack;
        }

        if (incomingStack.name == this.requestedItem.name) {
            if (incomingStack.curSize >= Math.abs(this.requestedItem.curSize)) {
                incomingStack.curSize += this.requestedItem.curSize;
                incomingStack.updateText();
                this.requestedItem.curSize = 0;
            } else {
                this.requestedItem.curSize += incomingStack.curSize;
                this.requestedItem.updateText();
                incomingStack.curSize = 0
            }

            // Check for empty stacks
            if (this.requestedItem.curSize == 0) {
                console.log("Request Fulfilled");
                orderTotal++;
                this.requestedItem.deconstructor();
                this.requestedItem = null;
            }
            if (incomingStack.curSize == 0) {
                incomingStack.deconstructor();
                return null;
            }
        } else {
            console.log("Wrong item was attempted to be pushed");
        }

        return incomingStack;
    }
}