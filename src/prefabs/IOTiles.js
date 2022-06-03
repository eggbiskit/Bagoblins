// General class for the input and output tiles
class IOTile extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene – Scene the tile is attatched to
     * @param {Number} posX – X Position of the tile
     * @param {Number} posY – Y Position of the tile
     */
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        scene.add.existing(this);
        this.setOrigin(0.5);
        this.setDepth(gameSettings.depths.UI);
        this.scene = scene;
        this.itemIndex = -1;
    }

    /**
     * Initiates the tween showing an object sliding to or from the inventory
     * 
     * @param {Object} startingObj – Where the stack will start
     * @param {Number} startingObj.x – Starting X coordinate
     * @param {Number} startingObj.y – Starting Y coordinate
     * @param {Object} endingObj – Where the stack will end
     * @param {Number} endingObj.x – Ending X coordinate
     * @param {Number} endingObj.y – Ending Y coordinate
     * @param {Number} numItems – The number of items in the stack
     * @param {boolean} fromInput – Whether or not this is being called from the input tile
     * @param {boolean} destroyOnEnd – Should fromInput be false, whether or not endingObj will be destroyed after the last tweened item
     */
    pushPullTween(startingObj, endingObj, numItems, fromInput = true, destroyOnEnd = false) {
        // Setting up what happens after the tweens complete
        let endBehavior = (fromInput) ? (tween) => {
            endingObj.setAlpha(1);
            endingObj.stackText.setAlpha(1);
        } : (tween) => {
            if (destroyOnEnd && tween.lastItem) {
                endingObj.deconstructor()
            }
        };

        for (let i = 0; i < numItems; i++) {
            let last = i == (numItems - 1);
            let tween = this.scene.addTween(
                new ItemStack(this.scene, { x: startingObj.x, y: startingObj.y }, 1, this.itemIndex).setDepth(gameSettings.depths.inOutTweens),
                "pullNPush",
                {
                    x: { "from": startingObj.x, "to": endingObj.x },
                    y: { "from": startingObj.y, "to": endingObj.y },
                    delay: i * 100,
                    onUpdate: (tween, targets) => { targets.positionText(); },
                    onComplete: (tween) => { tween.targets[0].deconstructor(); endBehavior(tween); }
                }
            );
            tween.lastItem = last;
        }
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
            let mergedItem = this.scene.inventory.getStack(cursor.coordinates.y, cursor.coordinates.x);

            if ((!this.curItem || this.curItem.curSize < startingSize) && mergedItem.curSize == startingSize) {
                mergedItem.setAlpha(0);
                mergedItem.stackText.setAlpha(0);
            }

            if (this.curItem) {
                let diff = startingSize - this.curItem.curSize;
                if (diff > 0) {
                    this.scene.inventory.itemCount[name] += diff;
                    this.pushPullTween(this, mergedItem, diff, true);
                    console.log("Pulled partial stack from input")
                } else {
                    console.log("Pulled no stack from input");
                    return false
                }
            } else {
                this.scene.inventory.itemCount[name] += startingSize;
                this.pushPullTween(this, mergedItem, startingSize, true);
                this.scene.removeTween(this.scene.inItemTween);
                console.log("Pulled full stack from input");
                this.itemIndex = -1;
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
            this.itemIndex = itemIndex;
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
            this.itemIndex = itemIndex;
        }

        return this.requestedItem;
    }

    /**
     * Pushes an item in the inventory to the output
     * 
     * @param {ItemStack} incomingStack – The stack currently being pushed
     * @param {Object} invenCoords – The coordinates of the inventory space being pulled from
     * @param {Number} invenCoords.x – Inventory space X coordinate
     * @param {Number} invenCoords.y – Inventory space Y coordinate
     * @returns – The remainder of the outgoing stack following the push (or null for an empty stack)
     */
    push(incomingStack, invenCoords) {
        if (!this.requestedItem) {
            console.error("No item requested");
            return incomingStack;
        }

        if (incomingStack.name == this.requestedItem.name) {
            // Compatable stacks
            let transferred;
            if (incomingStack.curSize >= Math.abs(this.requestedItem.curSize)) {
                incomingStack.curSize += this.requestedItem.curSize;
                incomingStack.updateText();
                transferred = -this.requestedItem.curSize;
                this.requestedItem.curSize = 0;
            } else {
                this.requestedItem.curSize += incomingStack.curSize;
                this.requestedItem.updateText();
                transferred = incomingStack.curSize;
                incomingStack.curSize = 0;
            }

            // Check for empty stacks
            if (this.requestedItem.curSize == 0) {
                console.log("Request Fulfilled");
                this.pushPullTween(invenCoords, this.requestedItem, transferred, false, true);
                this.requestedItem = null;
                this.itemIndex = -1;
            } else {
                console.log("Request Partially Fulfilled");
                this.pushPullTween(invenCoords, this.requestedItem, transferred, false, false);
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