class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        console.log("Menu");
        //const menuBg = this.add.image(game.config.width / 2, game.config.height / 2, 'menu_bg');
        //menuBg.setScale(3);

        this.title = this.add.sprite(game.config.width / 2, game.config.height / 5);
        this.title.setScale(3);
        this.anims.create({ 
            key: 'titleAni', 
            frames: this.anims.generateFrameNames('title_atlas', {      
                prefix: 'title',
                start: 1,
                end: 2,
            }), 
            frameRate: 5,
            repeat: -1 
        });

        this.title.anims.play('titleAni', true);
        
        const playButton = this.add.image(game.config.width / 2, game.config.height / 2 + 80, 'play_button')
        .setInteractive()
        // click button
        .on('pointerdown', () => {this.scene.start("tutorial"); this.sound.play("temp_sfx");})
        // pointer hovering on button
        .on('pointerover', () => playButton.setTexture('play_button_pressed'))
        // pointer not on button
        .on('pointerout', () => playButton.setTexture('play_button'));
        playButton.setScale(2);
    }
}