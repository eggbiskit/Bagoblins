const config = {
   type: Phaser.CANVAS,
   width: 200,
   height: 200,
   zoom: 4,
   autoCenter: true,
   physics: {
      default: "arcade"
  },
  scene: [Load, Menu, Play, Endgame]
};

let game = new Phaser.Game(config);

let keyLeft, keyRight, keyUp, keyDown, keySelect, keyInput, keyOutput;

// Game setting JSON files
let gameSettings;
let itemSpecs;