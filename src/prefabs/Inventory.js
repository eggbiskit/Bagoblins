class Inventory extends Phaser.GameObjects.Sprite {
    constructor(scene, rows, cols) {
        // Sprite Setup
        super(scene, game.config.width / 2, game.config.height / 2, "inventory");
        scene.add.existing(this);

        // Array Setup
        this.arrBounds = {
            cols: cols,
            rows: rows
        }
        this.contents = new Array(rows);
        for(let i = 0; i < rows; i++) {
            this.contents[i] = new Array(cols);
        }

        // Space Setup
        console.assert(this.displayWidth / cols === this.displayHeight / rows, "Error: Inventory is not made of squares");
        this.slotSize = this.displayWidth / cols;
    }

    /**
     * Gets the X,Y coordinates of the center of a given cell in world space
     * 
     * @param {int} row – the row of the input cell
     * @param {int} col – the col of the input cell
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
     * @param {*} row – The row of the stack to get
     * @param {*} col – The col of the stack to get
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
        if(!this.contents[row][col]) {
            // Put stack in spot
            console.log(incomingStack.coordinates);
            if(!fromInput) {
                this.contents[incomingStack.coordinates.row][incomingStack.coordinates.col] = undefined;
            }
            this.contents[row][col] = incomingStack;
            incomingStack.setSpot(row, col);
            return null;
        } else if(this.contents[row][col].name == incomingStack.name) {
            // Merge
            this.contents[row][col].curSize += incomingStack.curSize;
            if(this.contents[row][col].curSize > this.contents[row][col].maxSize) {
                incomingStack.curSize = this.contents[row][col].curSize - this.contents[row][col].maxSize;
                this.contents[row][col].curSize = this.contents[row][col].maxSize;
                return incomingStack;
            } else {
                return null;
            }
        } else {
            // Can't Merge
            console.log("Incompatible Stacks");
            return incomingStack;
        }
    }
}