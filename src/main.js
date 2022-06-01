const config = {
   type: Phaser.CANVAS,
   scale: {
      mode: Phaser.Scale.FIT,
      parent: "game-canvas",
      width: 320,
      height: 200,
      zoom: 3,
      autoCenter: Phaser.Scale.Center.CENTER_BOTH
   },
   scene: [Load, Menu, Tutorial, Tutorial2, Play, Endgame]
};

let game = new Phaser.Game(config);

let keyLeft, keyRight, keyUp, keyDown, keySelect, keyInput, keyOutput, keySpace;

// Game setting JSON files
let gameSettings, itemSpecs, tweenConfigs, soundConfigs;

// Global var
let endTime;
let endCause;

// Pause game on tab out
window.addEventListener("focus", function () {
   console.log("unpause");
});

window.addEventListener("blur", function () {
   console.log("pause");
});