class Endgame extends Phaser.Scene {
    constructor() {
        super("end");
    }

    create() {
        console.log("End");

        // bg
        const menuBg = this.add.image(game.config.width / 2, game.config.height / 2, 'menu_atlas', 'menu_bg').setScale(3);
        this.add.image(0, 180, 'play_atlas', 'table').setScale(2);  
        this.add.image(160, 180, 'play_atlas', 'table').setScale(2); 
        this.add.image(240, 180, 'play_atlas', 'table').setScale(2); 
        this.add.image(game.config.width / 2, game.config.height / 2 + 27, 'play_atlas', 'deco_inventory');

        this.add.image(game.config.width/2, game.config.height/2, 'menu_atlas', 'pinkslip');
        this.add.bitmapText(game.config.width/2 - 40, 70, 'pixel_font', 'EMPLOYEE: __GOBLIN__', 5);
        this.add.bitmapText(game.config.width/2 - 40, 90, 'pixel_font', 'TIME: _______________', 5);
        this.add.bitmapText(game.config.width/2 - 40, 110, 'pixel_font', 'REASON: ____________', 5);
        this.add.bitmapText(game.config.width/2 - 40, 120, 'pixel_font', '____________________', 5);
        this.add.bitmapText(game.config.width/2 - 40, 130, 'pixel_font', '____________________', 5);

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
            this.sound.play("temp_sfx");
            this.scene.start("menu");
        });
    }
}