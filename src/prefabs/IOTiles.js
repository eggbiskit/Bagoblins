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
}