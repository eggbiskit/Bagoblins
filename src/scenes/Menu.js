class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        console.log("Menu");
        
        // bg
        const menuBg = this.add.image(game.config.width / 2, game.config.height / 2, 'menu_bg');
        menuBg.setScale(3);

        // title animation
        this.title = this.add.sprite(game.config.width / 2, game.config.height / 5);
        this.title.setScale(2);
        this.anims.create({ 
            key: 'titleAni', 
            frames: this.anims.generateFrameNames('menu_atlas', {      
                prefix: 'title',
                start: 1,
                end: 2,
            }), 
            frameRate: 4,
            repeat: -1 
        });
        this.title.anims.play('titleAni', true);

        // potions animation
        this.potions = this.add.sprite(game.config.width / 2, game.config.height / 5 + 104, 'menu_atlas', 'potions');
        this.potions.setScale(2);


        // goblin animation
        this.title = this.add.sprite(game.config.width / 2, game.config.height - 70);
        this.title.setScale(2);
        this.anims.create({ 
            key: 'goblinAni', 
            frames: this.anims.generateFrameNames('menu_atlas', {      
                prefix: 'goblin',
                start: 1,
                end: 5,
            }), 
            frameRate: 2,
            repeat: -1 
        });
        this.title.anims.play('goblinAni', true);

        // play button
        const playButton = this.add.image(game.config.width / 2, game.config.height / 2 + 85, 'play_button')
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