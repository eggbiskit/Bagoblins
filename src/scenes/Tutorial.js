class Tutorial extends Phaser.Scene {
   constructor() {
       super("tutorial");
   }

   create() {
       console.log("Tutorial");

       const tutorialBg = this.add.image(game.config.width / 2, game.config.height / 2, 'tutorial');
       tutorialBg.setScale(2);
       
       const okButton = this.add.image(game.config.width / 2, game.config.height / 2 + 80, 'ok_button')
       .setInteractive()
       // click button
       .on('pointerdown', () => {this.scene.start("play"); this.sound.play("temp_sfx");})
       // pointer hovering on button
      //  .on('pointerover', () => playButton.setTexture('play_button_pressed'))
      //  // pointer not on button
      //  .on('pointerout', () => playButton.setTexture('play_button'));
      okButton.setScale(2);
   }
}