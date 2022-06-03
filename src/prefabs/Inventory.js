class Inventory extends Phaser.GameObjects.Sprite {
    /**
     * @param {Phaser.Scene} scene – The scene the inventory is tied to
     * @param {Number} rows – The number of rows (horizontal) in the inventory
     * @param {Number} cols – The number of columns (vertical) in the inventory
     */
    constructor(scene, rows, cols) {
        // Sprite Setup
        super(scene, game.config.width / 2, game.config.height / 2 + 30, 'play_atlas', '4x3inventory');
        scene.add.existing(this);
        this.setOrigin(0.5);
        this.setDepth(gameSettings.depths.UI);

        // Array Setup
        this.arrBounds = {
            cols: cols,
            rows: rows
        }
        this.contents = new Array(rows);
        for (let i = 0; i < rows; i++) {
            this.contents[i] = new Array(cols);
        }

        // Log of all items in inventory
        this.itemCount = {};
        for(let item of itemSpecs) {
            this.itemCount[item.textureName] = 0;
        }

        // Space Setup
        console.assert(this.displayWidth / cols === this.displayHeight / rows, "Error: Inventory is not made of squares");
        this.slotSize = this.displayWidth / cols;
    }

    /**
     * Gets the X,Y coordinates of the center of a given cell in world space
     * 
     * @param {Number} row – the row of the input cell
     * @param {Number} col – the col of the input cell
     * @returns the world-space X,Y coordinates of the center of the given cell
     */
    getSpaceCoords(row, col) {
        console.assert(0 <= row && row < this.arrBounds.rows, "Error: Row index out of bounds");
        console.assert(0 <= col && col < this.arrBounds.cols, "Error: Col index out of bounds");

        let topRow = this.y - this.displayHeight / 2 + this.slotSize / 2;
        let leftCol = this.x - this.displayWidth / 2 + this.slotSize / 2;
        return {
            x: leftCol + this.slotSize * col,
            y: topRow + this.slotSize * row
        };
    }

    /**
     * @returns whether or not the inventory has no items in it
     */
    isEmpty() {
        for(let elem in this.itemCount) {
            if(this.itemCount[elem] != 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param {Number} row – The row of the stack to get
     * @param {Number} col – The col of the stack to get
     * @returns the stack at the provided space (or undefined for an empty stack)
     */
    getStack(row, col) {
        return this.contents[row][col];
    }

    /**
     * Merges a held or input stack with the stack at the position indicated by the cursor
     * 
     * @param {ItemStack} incomingStack – The held or input stack to be merged
     * @param {number} row – The cursor's row
     * @param {number} col – The cursor's col
     * @param {boolean} fromInput – Whether or
     * @returns – What remains of the stack after the merge (or null for an empty stack)
     */
    mergeStacks(incomingStack, row, col, fromInput = false) {
        if (incomingStack.coordinates.row == row && incomingStack.coordinates.col == col) {
            // Return stack to spot
            return null
        } else if (!this.contents[row][col]) {
            // Put stack in spot
            if (!fromInput) {
                this.contents[incomingStack.coordinates.row][incomingStack.coordinates.col] = undefined;
            }
            this.contents[row][col] = incomingStack;
            incomingStack.setSpot(row, col);
            return null;
        } else if (this.contents[row][col].name == incomingStack.name) {
            // Merge
            this.contents[row][col].curSize += incomingStack.curSize;
            this.contents[row][col].updateText();
            if (this.contents[row][col].curSize > this.contents[row][col].maxSize) {
                incomingStack.curSize = this.contents[row][col].curSize - this.contents[row][col].maxSize;
                incomingStack.updateText();
                this.contents[row][col].curSize = this.contents[row][col].maxSize;
                this.contents[row][col].updateText();
                return incomingStack;
            } else {
                if (!fromInput) {
                    this.contents[incomingStack.coordinates.row][incomingStack.coordinates.col] = undefined;
                }
                incomingStack.deconstructor();
                return null;
            }
        } else {
            // Can't Merge
            console.log("Incompatible Stacks");
            this.scene.wrongMove();
            return incomingStack;
        }
    }

    /**
     * Pushes the stack located at the specified row and column to outputspace
     * Also decriments the respective itemCount property by the amount pushed
     * 
     * @param {Number} row – The row of the item to be pushed
     * @param {Number} col – The column of the item to be pushed
     * @param {OutputTile} outputSpace 
     * @returns whether or not the push was successful
     */
    pushStack(row, col, outputSpace) {
        let stack = this.getStack(row, col);

        if (stack) {
            console.log("Pushed stack to output");
            let name = stack.name;
            let size = stack.curSize;
            stack = outputSpace.push(stack, this.getSpaceCoords(row, col));
            if (stack) {
                this.contents[row][col] = stack;
                this.itemCount[name] -= (size - stack.curSize);
            } else {
                this.contents[row][col] = undefined;
                this.itemCount[name] -= size;
            }
            return true;
        } else {
            console.log("No stack to push");
            this.scene.wrongMove();
            return false;
        }
    }
}