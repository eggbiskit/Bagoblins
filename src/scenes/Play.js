class Play extends Phaser.Scene {

    constructor() {
        super("play");
    }

    create() {
        console.log("play");

        // Input Setup
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.left]);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.right]);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.up]);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.down]);
        keyInput = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.input]);
        keySelect = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.select]);
        keyOutput = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[gameSettings.keybinds.output]);

        // Game World Setup
        this.inventory = new Inventory(this, 4, 5).setOrigin(0.5);
        this.cursor = new Cursor(this.inventory);
        this.endOGame = false;

        // Input/Output setup
        this.inputSpace = new InputTile(this, game.config.width - 15, game.config.height - 15).setOrigin(0.5);
        this.outputSpace = new OutputTile(this, 15, game.config.height - 15).setOrigin(0.5);

        // Movement Setup
        keyLeft.on("down", () => {
            this.cursor.move(false, false);
        });
        keyRight.on("down", () => {
            this.cursor.move(false, true);
        });
        keyUp.on("down", () => {
            this.cursor.move(true, false);
        });
        keyDown.on("down", () => {
            this.cursor.move(true, true);
        });
        // C to pull from input
        keyInput.on("down", () => {
            if(!this.cursor.heldStack) {
                this.sound.play("temp_sfx");
                this.inputSpace.pull(this.cursor);
            } else {
                this.sound.play("temp_sfx");
                console.warn("Cannot pull or push while holding an item");
            }
        });
        // X to pick up, put down
        keySelect.on("down", () => {
            if (this.cursor.heldStack) {
                this.sound.play("temp_sfx");
                this.cursor.dropStack();
            } else {
                let pickedUp = this.cursor.pickUpStack();
                if (pickedUp) {
                    this.sound.play("temp_sfx");
                }
            }
        });
        // Z to push to output
        keyOutput.on("down", () => {
            if(!this.cursor.heldStack) {
                this.sound.play("temp_sfx");
                this.inventory.pushStack(this.cursor.coordinates.y, this.cursor.coordinates.x, this.outputSpace);
            } else {
                this.sound.play("temp_sfx");
                console.warn("Cannot pull or push while holding an item");
            }
        });

        // Item Generation
        this.inputGen = this.time.addEvent({
            delay: gameSettings.timings.item.headway * 1000,
            loop: true,
            startAt: gameSettings.timings.item.delay * 1000,
            callback: () => {
                if (!this.inputSpace.curItem) {
                    let itemIndex = Math.floor(Math.random() * itemSpecs.length);
                    let stackSize = Math.ceil(Math.random() * itemSpecs[itemIndex].maxSize);
                    this.inputSpace.createItem(stackSize, itemIndex);
                    this.sound.play("temp_sfx");
                    console.log("Item Created");
                } else {
                    this.endGame(this.inputSpace);
                }
            }
        });

        // Request Generation
        this.outputGen = this.time.addEvent({
            delay: gameSettings.timings.request.headway * 1000,
            loop: true,
            callback: () => {
                if (!this.outputSpace.requestedItem) {
                    let itemIndex;
                    do {
                        itemIndex = Math.floor(Math.random() * itemSpecs.length);
                    } while(this.inventory.itemCount[itemSpecs[itemIndex].textureName] <= 0);
                    
                    let maxStackSize = itemSpecs[itemIndex].maxSize;
                    let countInInventory = this.inventory.itemCount[itemSpecs[itemIndex].textureName];

                    console.log(countInInventory);
                    let maxRequestSize = (maxStackSize < countInInventory) ? maxStackSize : countInInventory;
                    let stackSize = Math.ceil(Math.random() * maxRequestSize);
                    this.outputSpace.createRequest(stackSize, itemIndex);
                    this.sound.play("temp_sfx");
                    console.log("Request Created");
                } else {
                    this.endGame(this.outputSpace);
                }
            }
        });

        // Temp tutorial Text
        let textConfig = {
            fontFamily: "Helvetica",
            fontSize: "12px",
            color: "#FFF",
            align: "center"
        };

        let moveControls = this.add.text(game.config.width / 2, 15, "Use ↑, ↓, ←, & → to move", textConfig).setOrigin(0.5);
        let inputControls = this.add.text(game.config.width - 20, game.config.height - 30, "Press\n'C' to\npull\nfrom\nthe\ninput", textConfig).setOrigin(0.5, 1);
        let selectControls = this.add.text(game.config.width / 2, game.config.height - 15, "Press 'X' to grab an item\nPress 'X' again to drop it", textConfig).setOrigin(0.5);
        let outputControls = this.add.text(20, game.config.height - 30, "Press\n'Z' to\npush\nto\nthe\noutput", textConfig).setOrigin(0.5, 1);
    }

    endGame(cause) {
        console.log(`Death from ${cause}`);
        this.sound.play("temp_sfx");
        this.time.delayedCall(1000, () => {
            this.scene.start('end', { fadeIn: true });
        });
        this.endOGame = true;
    }
}