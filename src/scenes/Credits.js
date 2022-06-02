class Credits extends Phaser.Scene {
   constructor() {
       super("credits");
   }

   create() {
      console.log("Credits");

      // fade in
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
         this.time.delayedCall(1000, () => {
            this.scene.start('tutorial')
         });
      });

      // assets
      this.add.image(game.config.width / 2, game.config.height / 2, 'tutorial_atlas', 'menu_bg').setScale(3); 
      this.add.image(game.config.width / 2, game.config.height / 2 - 4, 'tutorial_atlas', 'clipboard').setScale(2);
      this.add.image(game.config.width / 2, 45, 'menu_atlas', 'credits_title').setScale(2); 
      this.add.image(118, 45, 'menu_atlas', 'customer'); 
      this.add.image(200, 45, 'menu_atlas', 'customer').flipX = true; 


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

      this.add.bitmapText(130, 65, 'pixel_font', 'ALEXIS ADOLPHO', 5);
      this.add.bitmapText(135, 75, 'pixel_font', '(SFX + MUSIC)', 5).setAlpha(0.75);
      this.add.bitmapText(158, 82, 'pixel_font', '...', 5);
      this.add.bitmapText(127, 93, 'pixel_font', 'JACOB DICKERMAN', 5);
      this.add.bitmapText(123, 103, 'pixel_font', '(LEAD PROGRAMMER)', 5).setAlpha(0.75);
      this.add.bitmapText(158, 109, 'pixel_font', '...', 5);
      this.add.bitmapText(144, 119, 'pixel_font', 'GRACE HO', 5);
      this.add.bitmapText(120, 129, 'pixel_font', '(ARTIST + SUPPLEMENT-', 5).setAlpha(0.75);
      this.add.bitmapText(140, 139, 'pixel_font', 'ARY CODE)', 5).setAlpha(0.75);

      this.add.bitmapText(120, 155, 'pixel_gold', 'THANKS FOR PLAYING!', 5);
      this.add.bitmapText(121, 155, 'pixel_font', 'THANKS FOR PLAYING!', 5);


   }
}