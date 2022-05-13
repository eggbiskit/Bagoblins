class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        console.log("Menu");

        // SRC: https://snowbillr.github.io/blog//2018-07-03-buttons-in-phaser-3/
        const playButton = this.add.image(100, 100, 'play_button')
        .setInteractive()
        // click button
        .on('pointerdown', () => this.scene.start("play"))
        // pointer hovering  on button
        .on('pointerover', () =>  this.add.image(100, 100, 'play_button_pressed'))
        // pointer not on button
        .on('pointerout', () =>  this.add.image(100, 100, 'play_button'));
    }
}