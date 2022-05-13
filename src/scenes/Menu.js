class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        console.log("Menu");

        this.scene.start("play");
    }
}