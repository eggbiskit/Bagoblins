class Load extends Phaser.Scene {

   constructor() {
       super("load");
   }

   preload() {
       // Image Loading
       this.load.image("inventory", "assets/sprites/Inventory.png");
       this.load.image("tile", "assets/sprites/slot.png");
       this.load.image("cursor", "assets/sprites/Cursor.png");
       this.load.image("item", "assets/sprites/blackpotion.png");
       this.load.image("play_button", "assets/sprites/play_button.png");
       this.load.image("play_button_pressed", "assets/sprites/play_button_pressed.png");

       // SFX Loading
       // *temp sfx, replace later*
       this.load.audio("temp_sfx", "assets/SFX/select.wav");

       // JSON loading
       this.load.json("gameSettings", "src/settings/GameSettings.json");
       this.load.json("items", "src/settings/items.json");
   }

   create() {
       console.log("load");

       gameSettings = this.cache.json.get("gameSettings");
       itemSpecs = this.cache.json.get("items");
       
       this.scene.start("menu");
   }
}