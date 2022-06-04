class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    create() {
        console.log("Menu");

        // fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(1000, () => {
                this.scene.start('tutorial')
            });
        });

        // bg
        const menuBg = this.add.image(game.config.width / 2, game.config.height / 2, 'menu_atlas', 'menu_bg').setScale(3);

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
        this.desc = this.add.sprite(game.config.width / 2, game.config.height / 5 + 25, 'menu_atlas', 'desc');
        this.desc.setScale(1);

        // potions animation
        this.potions = this.add.sprite(game.config.width / 2 - 1, game.config.height / 5 + 100, 'menu_atlas', 'potions');
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

        // Start text animation
        this.play = this.add.sprite(game.config.width / 2, game.config.height / 5 + 142);
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

        // press space to start
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.space]);
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
                    this.scene.start('play');
                });
            }
        });

        // press c for credits
        keyInput = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.input]);

        this.add.sprite(game.config.width / 2, game.config.height / 5 + 150, 'menu_atlas', 'credits');
        keyInput.on("down", () => {
            if (!this.fading) {
                this.sound.play("temp_sfx");
                this.cameras.main.fadeOut(1000);
                this.fading = true;
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                    this.fading = false;
                    this.scene.start('credits');
                });
            }
        });
    }
}