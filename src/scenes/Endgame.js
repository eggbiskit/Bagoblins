class Endgame extends Phaser.Scene {
    constructor() {
        super("end");
    }

    create() {
        console.log("End");

        // fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(1000, () => {
                this.scene.start('tutorial')
            });
        });

        // bg
        const menuBg = this.add.image(game.config.width / 2, game.config.height / 2, 'menu_atlas', 'menu_bg').setScale(3);
        this.add.image(0, 183, 'play_atlas', 'table').setScale(2);
        this.add.image(160, 183, 'play_atlas', 'table').setScale(2);
        this.add.image(240, 183, 'play_atlas', 'table').setScale(2);
        this.add.image(40, 174, 'play_atlas', 'notes');
        this.add.image(295, 177, 'play_atlas', 'paper');
        this.add.image(70, 150, 'play_atlas', 'coffee_mug');
        this.add.image(20, 175, 'play_atlas', 'pencil');
        this.add.image(280, 168, 'play_atlas', 'pencil2');
        this.add.image(255, 170, 'play_atlas', 'dice');
        this.add.image(12, 153, 'play_atlas', 'potions1');
        this.add.image(305, 158, 'play_atlas', 'potions3');
        this.add.image(game.config.width / 2, game.config.height / 2 + 26, 'play_atlas', 'deco_inventory');
        this.add.image(game.config.width / 2, 65, 'play_atlas', 'deco_inventory_top');
        this.add.rectangle(0, 0, 1000, 1000, 0x466E58).alpha = 0.27; // tint bg objects

        this.add.image(game.config.width / 2, game.config.height / 2, 'menu_atlas', 'pinkslip');
        this.add.bitmapText(game.config.width / 2 - 40, 70, 'pixel_font', 'EMPLOYEE: __GOBLIN__', 5);
        this.add.bitmapText(game.config.width / 2 - 40, 90, 'pixel_font', 'ORDERS HANDL', 5);
        this.add.bitmapText(game.config.width / 2 + 14, 90, 'pixel_font', 'ED: ' + orderTotal, 5);
        this.add.bitmapText(game.config.width / 2 - 40, 110, 'pixel_font', 'REASON: ____________', 5);
        this.add.bitmapText(game.config.width / 2 - 40, 120, 'pixel_font', endCause.toUpperCase(), 5);
        this.add.bitmapText(game.config.width / 2 - 40, 130, 'pixel_font', '____________________', 5);

        // press space to start
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.space]);

        this.play = this.add.sprite(game.config.width / 2, game.config.height / 5 + 150);
        this.play.setScale(1.0);
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
            if (!this.fading) {
                this.sound.play("temp_sfx");
                // fade out
                this.input.keyboard.once('keydown-SPACE', () => {
                    this.cameras.main.fadeOut(1000, 0, 0, 0);
                    this.fading = true;
                });
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                    this.fading = false;
                    this.scene.start('menu');
                });
            }
        });
    }
}