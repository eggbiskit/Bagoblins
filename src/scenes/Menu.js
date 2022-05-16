class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        console.log("Menu");
        
        const playButton = this.add.image(game.config.width / 2, game.config.height / 2 + 20, 'play_button')
        .setInteractive()
        // click button
        .on('pointerdown', () => {this.scene.start("play"); this.sound.play("temp_sfx");})
        // pointer hovering on button
        .on('pointerover', () => playButton.setTexture('play_button_pressed'))
        // pointer not on button
        .on('pointerout', () => playButton.setTexture('play_button'));
    }
}