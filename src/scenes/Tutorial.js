class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorial");
    }

    create() {
        console.log("Tutorial pg 1");

        // fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(1000, () => {
                this.scene.start('tutorial')
            });
        });

        // assets
        const playBg = this.add.image(game.config.width / 2, game.config.height / 2, 'tutorial_atlas', 'menu_bg').setScale(3); 
        const clipb = this.add.image(game.config.width / 2, game.config.height / 2 - 4, 'tutorial_atlas', 'clipboard').setScale(2);
        const overview = this.add.image(game.config.width / 2, 40 , 'tutorial_atlas', 'tut_overview').setScale(2); 

        // c key
        this.add.image(160, 73, 'tutorial_atlas', 'bg_invoice');
        this.add.image(160, 76, 'tutorial_atlas', 'tut_potion_c');
        this.add.bitmapText(106, 103, 'pixel_font', 'C TO PUT INVOICE  IN INVENTORY', 5);

        // z key
        this.add.image(160, 137, 'tutorial_atlas', 'bg_orders');
        this.add.image(161, 134, 'tutorial_atlas', 'tut_potion_z').alpha = 0.5;
        this.add.bitmapText(117, 165, 'pixel_font', 'Z', 5);
        this.add.bitmapText(123, 165, 'pixel_font', 'TO SEND OUT ORDERS', 5);

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