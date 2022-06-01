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
let pausedScene;
let pauseTime;

// Pause game on tab out
window.addEventListener("focus", function () {
   if (pausedScene) {
      console.log("unpause");
      pausedScene.startTime += (this.performance.now() - pauseTime);
      game.scene.resume(pausedScene);
      pausedScene = undefined;
   }
});

window.addEventListener("blur", function () {
   if (!pausedScene) {
      console.log("pause");
      console.assert(game.scene.getScenes(true).length == 1, "Geddemmit Phaser");
      pausedScene = game.scene.getScenes(true)[0];
      pauseTime = pausedScene.time.now;
      game.scene.pause(pausedScene);
   }
});