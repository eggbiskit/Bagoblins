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
        const playBg = this.add.image(game.config.width / 2, game.config.height / 2, 'menu_bg').setScale(3);
        this.add.image(0, 180, 'table').setScale(2);  
        this.add.image(160, 180, 'table').setScale(2); 
        this.add.image(200, 180, 'table').setScale(2);  
        //this.add.image(100, 100, 'board');
        this.add.image(45, 40, 'frame');    // 3rd person POV
        const goblin_idle = this.add.image(40, 43, 'frame_goblin_idle');
        const goblin_work = this.add.image(47, 57, 'frame_goblin_work').setVisible(false);
        const goblin_c = this.add.image(42, 40, 'frame_goblin_c').setVisible(false);
        this.add.image(55, 62 , 'frame_shelf');
        this.add.image(25, 64, 'frame_candles');
        this.add.image(240, 130, 'small_drawers').setScale(1);
        this.add.image(240, 130, 'big_drawers').setScale(1);

        this.add.image(game.config.width / 2 - 1, 23, 'timer_frame').setOrigin(0.5); // Runtime clock background
        this.add.bitmapText(139, 9, 'pixel_gold', 'IT HAS BEEN', 5);
        this.add.bitmapText(126, 29, 'pixel_gold','SINCE AN ACCIDENT', 5);
        this.runtimeClock = this.add.bitmapText(game.config.width / 2, 21, 'pixel_gold', '00:00:00', 10).setOrigin(0.5);
        this.startTime;

        this.add.image(game.config.width / 2 + 1, game.config.height / 2 + 27, 'deco_inventory');
        this.inventory = new Inventory(this, 3, 4).setOrigin(0.5);
        this.cursor = new Cursor(this.inventory);
        this.endOGame = false;

        // Input/Output setup
        this.add.image(280, 130, 'invoice');                                                  // input box visual
        this.inputSpace = new InputTile(this, 280, 133).setOrigin(0.5);                       // input item
        this.inTimerFrame = this.add.rectangle(270, 160, 30, 5, 0xAAAAAA).setOrigin(0, 0.5);  // Timer bar background
        this.inputTimer = this.add.rectangle(270, 160, 30, 5, 0xFF0000).setOrigin(0, 0.5);    // Timer bar

        this.add.image(55, 130, 'memo').setScale(2);                                          // output box visual
        this.outputSpace = new OutputTile(this, 63, 130).setOrigin(0.5);                      // output item
        this.add.bitmapText(46, 110, 'pixel_gold', 'ORDER', 5);
        this.outTimerFrame = this.add.rectangle(46, 160, 30, 5, 0xAAAAAA).setOrigin(0, 0.5);  // Timer bar background
        this.outputTimer = this.add.rectangle(46, 160, 30, 5, 0xFF0000).setOrigin(0, 0.5);    // Timer bar

        // Movement Setup  
        keyLeft.on("down", () => {
            this.cursor.move(false, false);
            goblin_idle.setVisible(false);   // hide idle state for work state
            goblin_work.setVisible(true);
        });
        keyLeft.on("up", () => {             // delay work anim for a bit, resume idle after inactivity
            this.time.addEvent({ delay: 2000, callback: () => { goblin_work.setVisible(false); }, loop: true });
            this.time.addEvent({ delay: 2000, callback: () => { goblin_idle.setVisible(true); }, loop: true });
        });

        keyRight.on("down", () => {
            this.cursor.move(false, true);
            goblin_idle.setVisible(false);
            goblin_work.setVisible(true);
        });
        keyRight.on("up", () => {
            this.time.addEvent({ delay: 2000, callback: () => { goblin_work.setVisible(false); }, loop: true });
            this.time.addEvent({ delay: 2000, callback: () => { goblin_idle.setVisible(true); }, loop: true });
        });

        keyUp.on("down", () => {
            this.cursor.move(true, false);
            goblin_idle.setVisible(false);
            goblin_work.setVisible(true);
        });
        keyUp.on("up", () => {
            this.time.addEvent({ delay: 2000, callback: () => { goblin_work.setVisible(false); }, loop: true });
            this.time.addEvent({ delay: 2000, callback: () => { goblin_idle.setVisible(true); }, loop: true });
        });
        
        keyDown.on("down", () => {
            this.cursor.move(true, true);
            goblin_idle.setVisible(false);
            goblin_work.setVisible(true);
        });
        keyDown.on("up", () => {
            this.time.addEvent({ delay: 2000, callback: () => { goblin_work.setVisible(false); }, loop: true });
            this.time.addEvent({ delay: 2000, callback: () => { goblin_idle.setVisible(true); }, loop: true });
        });

        // C to pull from input
        keyInput.on("down", () => {
            goblin_idle.setVisible(false);
            goblin_work.setVisible(true);
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
                    //this.endGame(this.inputSpace);
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
                    //this.endGame(this.outputSpace);
                }
            }
        });

        // Diffuculty Curve Stuff
        // Speed up item generation
        this.itemCurve = this.time.addEvent({
            delay: gameSettings.timings.item.increase.time * 1000,
            paused: true,
            loop: true,
            callback: () => { this.inputGen.delay /= gameSettings.timings.item.increase.rate; console.warn("Item Spawn speed up"); }
        });

        // Speed up request generation
        this.requestCurve = this.time.addEvent({
            delay: gameSettings.timings.request.increase.time * 1000,
            paused: true,
            loop: true,
            callback: () => { this.outputGen.delay /= gameSettings.timings.request.increase.rate; console.warn("Request speed up"); }
        });

        // Begin item spawning
        this.inputDelay = this.time.delayedCall(gameSettings.timings.item.delay * 1000, () => {
            console.log("input timer begin");
            this.inputGen.paused = false;
            this.itemCurve.paused = false;
        });

        // Begin the requests
        this.outputDelay = this.time.delayedCall(gameSettings.timings.request.delay * 1000, () => { 
            console.log("output timer begin");
            this.outputGen.paused = false;
            this.requestCurve.paused = false 
        });
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
        // Sets startTime to time at first update
        if(!this.startTime) {
            this.startTime = this.time.now;
        }

        // Update input timer
        let curInputTimer;
        if(this.inputGen.paused) {
            curInputTimer = this.inputDelay;
        } else {
            curInputTimer = this.inputGen;
        }
        this.inputTimer.width = curInputTimer.getOverallProgress() * this.inTimerFrame.width;

        // Update output timer
        let curOutputTimer;
        if(this.outputGen.paused) {
            curOutputTimer = this.outputDelay;
        } else {
            curOutputTimer = this.outputGen;
        }
        this.outputTimer.width = curOutputTimer.getOverallProgress() * this.outTimerFrame.width;

        // Update runtime timer
        let elapsed = this.time.now - this.startTime;
        let mins = this.formatTimeText(Math.floor(elapsed / 60000));
        let secs = this.formatTimeText(Math.floor(elapsed / 1000) - mins * 60);
        let mills = this.formatTimeText(Math.floor(elapsed / 10) - secs * 100 - mins * 6000);

        this.runtimeClock.setText(`${mins}:${secs}:${mills}`);
    }

    formatTimeText(time) {
        return (time < 10) ? `0${time}` : time;
    }
}