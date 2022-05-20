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
        // bg elements
        const playBg = this.add.image(game.config.width / 2, game.config.height / 2, 'play_bg');
        playBg.setScale(5);
        this.add.image(45, 40, 'frame');    // 3rd person POV
        this.add.image(40, 40, 'frame_goblin_idle');
        this.add.image(55, 60, 'frame_shelf');
        this.add.image(25, 62, 'frame_candles');
        this.add.image(80, 130, 'board');   // output board
        this.add.image(240, 130, 'board');  // input board

        this.inventory = new Inventory(this, 3, 4).setOrigin(0.5);
        this.cursor = new Cursor(this.inventory);
        this.endOGame = false;

        // Input/Output setup
        this.add.image(240, 130, 'invoice');                                // input box visual
        this.inputSpace = new InputTile(this, 240, 130).setOrigin(0.5);     // input item
        this.inTimerFrame = this.add.rectangle(225, 160, 30, 5, 0xAAAAAA);  // Timer bar background
        this.inTimerFrame.setOrigin(0, 0.5);
        this.inputTimer = this.add.rectangle(225, 160, 30, 5, 0xFF0000);    // Timer bar
        this.inputTimer.setOrigin(0, 0.5);

        this.add.image(83, 130, 'memo');                                     // output box visual
        this.outputSpace = new OutputTile(this, 83, 130).setOrigin(0.5);     // output item

        // Instruction Text (must type in caps)
        /* Temp text; remove when tutorial is complete */
        this.add.bitmapText(20, game.config.height - 10, 'pixel_font', 'C TO STOCK', 5);
        this.add.bitmapText(20, game.config.height - 20, 'pixel_font', 'X TO GRAB/UNGRAB, STACK MAX 10 POTIONS', 5);
        this.add.bitmapText(20, game.config.height - 30, 'pixel_font', 'Z TO FULFILL ORDER', 5);

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
        let inputDelay = gameSettings.timings.item.headway * 1000;
        this.inputGen = this.time.addEvent({
            delay: inputDelay,
            startAt: inputDelay,
            loop: true,
            paused: true,
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
        this.inputDelay = this.time.delayedCall(gameSettings.timings.item.delay * 1000, () => { console.log("input timer begin"); this.inputGen.paused = false });

        // Request Generation
        let outputDelay = gameSettings.timings.request.headway * 1000;
        this.outputGen = this.time.addEvent({
            delay: outputDelay,
            startAt: outputDelay,
            loop: true,
            paused: true,
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
        this.outputDelay = this.time.delayedCall(gameSettings.timings.request.delay * 1000, () => { console.log("output timer begin"); this.outputGen.paused = false });

        this.startingTime = this.time.now;
    }

    endGame(cause) {
        console.log(`Death from ${cause}`);
        this.sound.play("death");
        this.time.removeAllEvents();
        this.time.delayedCall(1000, () => {
            this.scene.start('end', { fadeIn: true });
        });
        this.endOGame = true;
    }

    update() {
        // Update input timer
        let curInputTimer;
        if(this.inputGen.paused) {
            curInputTimer = this.inputDelay;
        } else {
            curInputTimer = this.inputGen;
        }
        this.inputTimer.width = curInputTimer.getOverallProgress() * this.inTimerFrame.width;
    }
}