class Endgame extends Phaser.Scene {
    constructor() {
        super("end");
    }

    create() {
        console.log("End");

        this.scene.start("menu");
    }
}