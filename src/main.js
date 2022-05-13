const config = {
   type: Phaser.CANVAS,
   width: 200,
   height: 160,
   zoom: 5,
   physics: {
      default: "arcade"
  },
  scene: [Load, Menu, Play, Endgame]
};

let game = new Phaser.Game(config);

let keyLeft, keyRight, keyUp, keyDown, keySelect, keyInput, keyOutput;