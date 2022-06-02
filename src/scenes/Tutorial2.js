class Tutorial2 extends Phaser.Scene {
   constructor() {
       super("tutorial2");
   }

   create() {
       console.log("Tutorial pg 2");

        // assets
        this.add.image(game.config.width / 2, game.config.height / 2, 'tutorial_atlas', 'menu_bg').setScale(3); 
        this.add.image(game.config.width / 2, game.config.height / 2 - 4, 'tutorial_atlas', 'clipboard').setScale(2);
        this.add.image(game.config.width / 2, 40 , 'tutorial_atlas', 'tut_overview').setScale(2); 

        // c key
        this.add.image(160, 73, 'tutorial_atlas', 'bg_invoice');
        this.add.image(160, 76, 'tutorial_atlas', 'tut_potion_c');
        this.add.bitmapText(106, 103, 'pixel_font', 'C TO PUT INVOICE  IN INVENTORY', 5);

        // z key
        this.add.image(160, 137, 'tutorial_atlas', 'bg_orders');
        this.add.image(161, 134, 'tutorial_atlas', 'tut_potion_z').alpha = 0.5;
        this.add.bitmapText(120, 165, 'pixel_font', 'Z', 5);
        this.add.bitmapText(126, 165, 'pixel_font', 'TO SEND OUT ORDERS', 5);

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
            this.scene.start("play");
        });
    }
}