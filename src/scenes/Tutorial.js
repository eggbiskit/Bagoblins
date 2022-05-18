class Tutorial extends Phaser.Scene {
   constructor() {
       super("tutorial");
   }

   create() {
       console.log("Tutorial");

       const tutorialBg = this.add.image(game.config.width / 2, game.config.height / 2, 'play_atlas', 'tutorial');
       tutorialBg.setScale(2);

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
           this.scene.start('play');
       });
   }
}