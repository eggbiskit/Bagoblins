class Tutorial2 extends Phaser.Scene {
   constructor() {
       super("tutorial2");
   }

   create() {
       console.log("Tutorial pg 2");

       // assets
       const playBg = this.add.image(game.config.width / 2, game.config.height / 2, 'tutorial_atlas', 'menu_bg').setScale(3); 
       const clipb = this.add.image(game.config.width / 2, game.config.height / 2 - 4, 'tutorial_atlas', 'clipboard').setScale(2);
       const overview = this.add.image(game.config.width / 2, 40 , 'tutorial_atlas', 'tut_overview').setScale(2); 

       // arrow keys
       this.ak = this.add.sprite(160, 75);
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
       
       this.ak.anims.play('akAni');
       this.add.bitmapText(130, 105, 'pixel_font', 'ARROW KEYS TO', 5);
       this.add.bitmapText(115, 112, 'pixel_font', 'MOVE AROUND INVENTORY', 5); // +7 pix for next line

       // x key
       this.x = this.add.sprite(160, 135);
       this.anims.create({
           key: 'xAni',
           frames: this.anims.generateFrameNames('tutorial_atlas', {
               prefix: 'tut_x',
               start: 1,
               end: 2 ,
           }),
           frameRate: 1 ,
           repeat: -1
       });
       this.x.anims.play('xAni');
       this.add.bitmapText(101, 152, 'pixel_font', 'X TO GRAB AND UNGRAB POTIONS', 5);
       this.add.bitmapText(112, 159, 'pixel_font', 'STACK UP TO  +10+  POTIONS', 5);

       this.ak.anims.remove('xAni');
       this.x.anims.remove('xAni');

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