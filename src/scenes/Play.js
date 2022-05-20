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
        const playBg = this.add.image(game.config.width / 2, game.config.height / 2, 'play_bg');
        playBg.setScale(3);
        this.inventory = new Inventory(this, 3, 4).setOrigin(0.5);
        this.cursor = new Cursor(this.inventory);
        this.endOGame = false;

        // Input/Output setup
        const in_box = this.add.image(game.config.width - 15, game.config.height - 15, 'play_atlas', 'in_box');
        in_box.setScale(1);
        const out_box = this.add.image(15, game.config.height - 15, 'play_atlas', 'out_box');
        out_box.setScale(1);
        this.inputSpace = new InputTile(this, game.config.width - 15, game.config.height - 15).setOrigin(0.5);
        this.outputSpace = new OutputTile(this, 15, game.config.height - 15).setOrigin(0.5);

        // Instruction Text (must type in caps)
        this.add.bitmapText(game.config.width / 3, game.config.height - 10, 'pixel_font', 'C TO STOCK', 5);
        this.add.bitmapText(game.config.width / 3, game.config.height - 20, 'pixel_font', 'X TO GRAB/UNGRAB', 5);
        this.add.bitmapText(game.config.width / 3, game.config.height - 30, 'pixel_font', 'Z TO FULFILL ORDER', 5);

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
                this.sound.play("input_pull");
                this.inputSpace.pull(this.cursor);
            } else {
                this.sound.play("wrong");
                console.warn("Cannot pull or push while holding an item");
            }
        });
        // X to pick up, put down
        keySelect.on("down", () => {
            if (this.cursor.heldStack) {
                this.sound.play("drop_stack");
                this.cursor.dropStack();
            } else {
                let pickedUp = this.cursor.pickUpStack();
                if (pickedUp) {
                    this.sound.play("pick_up_stack");
                } else {
                    this.sound.play("wrong");
                }
            }
        });
        // Z to push to output
        keyOutput.on("down", () => {
            if(!this.cursor.heldStack) {
                this.sound.play("output_push");
                this.inventory.pushStack(this.cursor.coordinates.y, this.cursor.coordinates.x, this.outputSpace);
            } else {
                this.sound.play("wrong");
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
                    this.sound.play("create");
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
                    let itemIndex, countInInventory;
                    if(this.inventory.isEmpty()) {
                        // Fail-safe to avoid infinite loop
                        if(this.inputSpace.curItem) {
                            itemIndex = itemSpecs.findIndex(elem => elem.textureName == this.inputSpace.curItem.name);
                            countInInventory = this.inputSpace.curItem.curSize;
                        } else {
                            console.error("Error: Request made before items spawned");
                            this.endGame("Shitty Game Design");
                        }
                    } else {
                        do {
                            itemIndex = Math.floor(Math.random() * itemSpecs.length);
                        } while(this.inventory.itemCount[itemSpecs[itemIndex].textureName] <= 0);
                        countInInventory = this.inventory.itemCount[itemSpecs[itemIndex].textureName];
                    }
                    
                    let maxStackSize = itemSpecs[itemIndex].maxSize;

                    let maxRequestSize = (maxStackSize < countInInventory) ? maxStackSize : countInInventory;
                    let stackSize = Math.ceil(Math.random() * maxRequestSize);
                    this.outputSpace.createRequest(stackSize, itemIndex);
                    this.sound.play("request");
                    console.log("Request Created");
                } else {
                    this.endGame(this.outputSpace);
                }
            }
        });
    }

    endGame(cause) {
        console.log(`Death from ${cause}`);
        this.sound.play("death");
        this.time.delayedCall(1000, () => {
            this.scene.start('end', { fadeIn: true });
        });
        this.endOGame = true;
    }
}