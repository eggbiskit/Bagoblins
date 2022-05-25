const config = {
   type: Phaser.CANVAS,
   width: 320,
   height: 200,
   zoom: 3,
   autoCenter: true,
   scene: [Load, Menu, Tutorial, Tutorial2, Play, Endgame]
};

let game = new Phaser.Game(config);

let keyLeft, keyRight, keyUp, keyDown, keySelect, keyInput, keyOutput, keySpace;

// Game setting JSON files
let gameSettings;
let itemSpecs;