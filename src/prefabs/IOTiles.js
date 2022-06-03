// General class for the input and output tiles
class IOTile extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.scene} scene – Scene the tile is attatched to
     * @param {Number} posX – X Position of the tile
     * @param {Number} posY – Y Position of the tile
     */
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        scene.add.existing(this);
        this.setOrigin(0.5);
        this.setDepth(gameSettings.depths.UI);
        this.scene = scene;
    }
}

// Class for the input tile
class InputTile extends IOTile {
    /**
     * See {@link IOTile} for param details
     */
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        this.curItem = null;
    }

    /**
     * Moves the current stack to the inventory at the cursor's location
     * 
     * @param {Cursor} cursor – The cursor
     * @returns whether or not the pull was successful
     */
    pull(cursor) {
        if (this.curItem) {
            let startingSize = this.curItem.curSize;
            let name = this.curItem.name;
            this.curItem = this.scene.inventory.mergeStacks(this.curItem, cursor.coordinates.y, cursor.coordinates.x, true);
            if (this.curItem) {
                let diff = startingSize - this.curItem.curSize;
                if(diff > 0) {
                    this.scene.inventory.itemCount[name] += diff;
                    console.log("Pulled partial stack from input")
                } else {
                    console.log("Pulled no stack from input");
                    return false
                }
            } else {
                this.scene.inventory.itemCount[name] += startingSize;
                this.scene.removeTween(this.scene.inItemTween);
                console.log("Pulled full stack from input");
            }
            return true;
        } else {
            console.error("No stack to pull");
            return false;
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

// Class for the output tile
class OutputTile extends IOTile {
    /**
     * See {@link IOTile} for param details
     */
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
            console.error("No item requested");
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