class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        console.log("Menu");
        
        const playButton = this.add.image(100, 100, 'play_button')
        .setInteractive()
        // click button
        .on('pointerdown', () => this.scene.start("play"))
        // pointer hovering on button
        .on('pointerover', () => playButton.setTexture('play_button_pressed'))
        // pointer not on button
        .on('pointerout', () => playButton.setTexture('play_button'));
    }
}