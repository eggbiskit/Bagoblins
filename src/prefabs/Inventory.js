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

    getItem(row, col) {
        return this.contents[row][col];
    }

    mergeStacks(incomingStack, row, col) {
        if(!this.contents[row][col]) {
            // Put stack in spot
            this.contents[incomingStack.coordinates.row][incomingStack.coordinates.col] = undefined;
            this.contents[row][col] = incomingStack;
            incomingStack.setSpot(row, col);
            return null;
        }
    }
}