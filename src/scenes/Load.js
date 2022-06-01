class Load extends Phaser.Scene {

    constructor() {
        super("load");
    }

    preload() {
        // loading bar
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        let UIDistance = game.config.width / 15;
        let loadX = {
            min: UIDistance,
            max: game.config.width - 2 * UIDistance
        }
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 // reset fill/line style
            loadingBar.fillStyle(0xFFFFFF, 1);                  // (color, alpha)
            loadingBar.fillRect(loadX.min, game.config.height / 2, loadX.max * value, 5);  // (x, y, w, h)
        });

        // Item image loading
        this.load.image("blackPotion", "assets/sprites/blackpotion.png");
        this.load.image("greenPotion", "assets/sprites/greenpotion.png");
        this.load.image("bluePotion", "assets/sprites/bluepotion.png");
        this.load.image("purplePotion", "assets/sprites/purplepotion.png");

        // Texture Atlas Loading
        this.load.atlas('menu_atlas', 'assets/sprites/menu_sheet.png', 'assets/sprites/menu.json');
        this.load.atlas('tutorial_atlas', 'assets/sprites/tutorial_sheet.png', 'assets/sprites/tutorial.json');
        this.load.atlas('play_atlas', 'assets/sprites/play_sheet.png', 'assets/sprites/play.json');

        // Font loading
        this.load.bitmapFont('pixel_font', 'assets/font/pixel.png', 'assets/font/pixel.xml');
        this.load.bitmapFont('pixel_gold', 'assets/font/pixel_gold.png', 'assets/font/pixel_gold.xml');

        // SFX Loading
        // *temp sfx, replace later*
        this.load.audio("temp_sfx", "assets/SFX/select.mp3");
        this.load.audio("input_pull", "assets/SFX/moveItem.wav");
        this.load.audio("drop_stack", "assets/SFX/drop.wav");
        this.load.audio("pick_up_stack", "assets/SFX/pickUp.wav");
        this.load.audio("output_push", "assets/SFX/moveItem.wav");
        this.load.audio("create", "assets/SFX/appear.mp3");
        this.load.audio("request", "assets/SFX/receiving.wav");
        this.load.audio("wrong", "assets/SFX/request.mp3");
        this.load.audio("death", "assets/SFX/440773__mgamabile__smashing-glass (1).wav");
        this.load.audio("move", "assets/SFX/move.mp3");
        this.load.audio("BGM", "assets/music/BagTheme.wav");

        // JSON loading
        this.load.json("gameSettings", "src/settings/GameSettings.json");
        this.load.json("items", "src/settings/Items.json");
        this.load.json("tweens", "src/settings/TweenConfigs.json");
        this.load.json("SFX", "src/settings/SoundConfigs.json");
    }

    create() {
        console.log("load");

        gameSettings = this.cache.json.get("gameSettings");
        itemSpecs = this.cache.json.get("items");
        tweenConfigs = this.cache.json.get("tweens");
        soundConfigs = this.cache.json.get("SFX");

        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('menu');
        });
    }
}