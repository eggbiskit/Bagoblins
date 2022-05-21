class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorial");
    }

    create() {
        console.log("Tutorial");

        // assets
        const playBg = this.add.image(game.config.width / 2, game.config.height / 2, 'play_bg');
        playBg.setScale(5); 
        const clipb = this.add.image(game.config.width / 2, game.config.height / 2 - 4, 'clipboard');
        clipb.setScale(2);
        const overview = this.add.image(game.config.width / 2, 40 , 'overview');
        overview.setScale(2); 

        // c key
        this.add.image(0, 0, 'invoice');
        this.add.image(0,0, 'greenPotion');
        this.add.bitmapText(20, game.config.height - 10, 'pixel_font', 'C TO RECIEVE INVOICE ORDER', 5);

        // z key
        this.add.image(0, 0, 'memo');
        this.add.image(0,0, 'blackPotion');
        this.add.bitmapText(20, game.config.height - 10, 'pixel_font', 'Z TO SEND OUT DELIVERIES', 5);

        // arrow keys
        this.ak = this.add.sprite(game.config.width / 2, game.config.height / 5);
        this.ak.setScale(1);
        this.anims.create({
            key: 'akAni',
            frames: this.anims.generateFrameNames('tutorial_atlas', {
                prefix: 'tut_arrowkey',
                start: 1,
                end: 4,
            }),
            frameRate: 2,
            repeat: -1
        });
        this.ak.anims.play('akAni', true);
        this.add.bitmapText(20, game.config.height - 10, 'pixel_font', 'ARROW KEYS TO MOVE AROUND INVENTORY', 5);

        // x key
        this.x = this.add.sprite(game.config.width / 2, game.config.height / 5);
        this.x.setScale(1);
        this.anims.create({
            key: 'xAni',
            frames: this.anims.generateFrameNames('tutorial_atlas', {
                prefix: 'tut_x',
                start: 1,
                end: 3,
            }),
            frameRate: 2,
            repeat: -1
        });
        this.x.anims.play('xAni', true);
        this.add.bitmapText(20, game.config.height - 10, 'pixel_font', 'STACK UP TO 10 IDENTICAL POTIONS', 5);
        this.add.bitmapText(20, game.config.height - 10, 'pixel_font', 'X TO GRAB AND UNGRAB POTIONS', 5);

        // press space to play
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.space]);
        this.play = this.add.sprite(game.config.width / 2, game.config.height / 5 + 150);
        this.play.setScale(1);
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
            this.scene.start('play');
        });
    }
}