class Load extends Phaser.Scene {

   constructor() {
       super("load");
   }

   preload() {
       this.load.image("inventory", "assets/sprites/Inventory.png");
       this.load.image("tile", "assets/sprites/slot.png");
       this.load.image("cursor", "assets/sprites/Cursor.png");
       this.load.image("item", "assets/sprites/blackpotion.png");
       this.load.image("play_button", "assets/sprites/play_button.png");
       this.load.image("play_button_pressed", "assets/sprites/play_button_pressed.png");
   }

   create() {
       console.log("load");
       
       this.scene.start("menu");
   }
}