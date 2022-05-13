class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        console.log("Menu");

        // SRC: https://snowbillr.github.io/blog//2018-07-03-buttons-in-phaser-3/
        const playButton = this.add.image(100, 100, 'play_button');
        playButton.setInteractive()
        playButton.on('pointerdown', () => this.scene.start("play"));
        playButton.on('pointerover', () => { playButton.setTexture('play_button_pressed'); });
        playButton.on('pointerout', () => { playButton.setTexture('play_button'); })

        //this.scene.start("play");
    }
}