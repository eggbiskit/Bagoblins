class Load extends Phaser.Scene {

   constructor() {
       super("load");
   }

   preload() {
       // Image Loading
       this.load.image("inventory", "assets/sprites/Inventory.png");
       this.load.image("tile", "assets/sprites/slot.png");
       this.load.image("item", "assets/sprites/blackpotion.png");
       this.load.image("cursor", "assets/sprites/Cursor.png");
       this.load.image("menu_bg", "assets/sprites/menu_bg.png");
       this.load.image("tutorial", "assets/sprites/tutorial.png");

       // texture atlas
       this.load.atlas('menu_atlas', 'assets/sprites/menu_sheet.png', 'assets/sprites/menu.json');
       this.load.atlas('play_atlas', 'assets/sprites/play_sheet.png', 'assets/sprites/play.json');

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