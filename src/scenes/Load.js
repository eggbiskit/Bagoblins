class Load extends Phaser.Scene {

   constructor() {
       super("load");
   }

   preload() {
       this.load.image("inventory", "assets/sprites/Inventory.png");
       this.load.image("tile", "assets/sprites/slot.png");
       this.load.image("cursor", "assets/sprites/Cursor.png");
       this.load.image("item", "assets/sprites/blackpotion.png")
   }

   create() {
       console.log("load");
       
       this.scene.start("menu");
   }
}