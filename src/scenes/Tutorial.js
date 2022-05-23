class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorial");
    }

    create() {
        console.log("Tutorial");

        // assets
        const playBg = this.add.image(game.config.width / 2, game.config.height / 2, 'menu_bg').setScale(3); 
        const clipb = this.add.image(game.config.width / 2, game.config.height / 2 - 4, 'tutorial_atlas', 'clipboard').setScale(2);
        const overview = this.add.image(game.config.width / 2, 40 , 'tutorial_atlas', 'tut_overview').setScale(2); 

        // c key
        this.add.image(160, 75, 'tutorial_atlas', 'bg_invoice');
        this.add.image(160, 79, 'tutorial_atlas', 'tut_potion_c');
        this.add.bitmapText(111, 105, 'pixel_font', 'C TO RECIEVE INVOICE ORDER', 5);

        // z key
        this.add.image(160, 135, 'tutorial_atlas', 'memo').setScale(1.5);
        this.add.bitmapText(150, 120, 'pixel_gold', 'ORDER', 5);
        this.add.image(161, 138, 'tutorial_atlas', 'tut_potion_z').alpha = 0.5;
        this.add.bitmapText(117, 160, 'pixel_font', 'Z', 5);
        this.add.bitmapText(123, 160, 'pixel_font', 'TO SEND OUT DELIVERIES', 5);

        // press space to play
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.space]);
        this.play = this.add.sprite(game.config.width / 2, game.config.height / 5 + 150);
        this.anims.create({
            key: 'playAni',
            frames: this.anims.generateFrameNames('menu_atlas', {
                prefix: 'play',
                start: 1,
                end: 2,
            }),
            frameRate: 2,
            repeat: -1
        });
        this.play.anims.play('playAni', true);

        keySpace.on("down", () => {
            this.sound.play("temp_sfx");
            this.scene.start("tutorial2");
        });
    }
}