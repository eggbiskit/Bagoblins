class IOTile extends Phaser.GameObjects.Sprite {
    constructor(scene, posX, posY) {
        super(scene, posX, posY, "tile");
        scene.add.existing(this);
    }
}

class InputTile extends IOTile {
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        this.curItem = null;
    }
}

class OutputTile extends IOTile {
    constructor(scene, posX, posY) {
        super(scene, posX, posY);
        this.requestedItem = null;
    }
}