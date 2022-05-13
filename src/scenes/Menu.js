class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        console.log("Menu");

        // SRC: https://snowbillr.github.io/blog//2018-07-03-buttons-in-phaser-3/
        const playButton = this.add.image(100, 100, 'play_button')
        .setInteractive()
        .on('pointerdown', () => this.scene.start("play"));
        playButton.on('pointerover', () => { this.add.image(100, 100, 'play_button_pressed'); });

        //this.scene.start("play");
    }
}