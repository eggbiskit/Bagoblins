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
        // Background assets
        const playBg = this.add.image(game.config.width / 2, game.config.height / 2, 'play_atlas', 'menu_bg').setScale(3);
        this.add.image(0, 183, 'play_atlas', 'table').setScale(2);
        this.add.image(160, 183, 'play_atlas', 'table').setScale(2);
        this.add.image(240, 183, 'play_atlas', 'table').setScale(2);
        this.add.image(40, 174, 'play_atlas', 'notes');
        this.add.image(295, 177, 'play_atlas', 'paper');
        this.add.image(70, 150, 'play_atlas', 'coffee_mug');
        this.add.image(20, 175, 'play_atlas', 'pencil');
        this.add.image(280, 168, 'play_atlas', 'pencil2');
        this.add.image(255, 170, 'play_atlas', 'dice');
        this.add.image(12, 153, 'play_atlas', 'potions1');
        this.add.image(305, 158, 'play_atlas', 'potions3');
        this.add.rectangle(0, 0, 1000, 1000, 0x466E58).alpha = 0.27; // tint bg objects

        // Frame assets
        this.add.image(276, 38, 'play_atlas', 'frame');              // 3rd person POV
        this.add.image(44, 38, 'play_atlas', 'frame_customer');      // show customers
        this.goblin_idle = this.add.image(268, 40, 'play_atlas', 'frame_goblin_idle');
        this.goblin_work = this.add.image(281, 53, 'play_atlas', 'frame_goblin_work').setVisible(false);
        const customer = this.add.image(45, 48, 'play_atlas', 'frame_customer1').setVisible(false);
        this.add.image(289, 58, 'play_atlas', 'frame_shelf');
        this.add.image(255, 60, 'play_atlas', 'frame_candles');
        this.add.image(68, 54, 'play_atlas', 'frame_order_tablets');
        this.add.image(23, 57, 'play_atlas', 'frame_order_tablet');

        // Timer assets
        this.add.image(game.config.width / 2 - 1, 23, 'play_atlas', 'timer_frame').setOrigin(0.5); // Runtime clock background
        this.add.bitmapText(139, 9, 'pixel_gold', 'IT HAS BEEN', 5);
        this.add.bitmapText(126, 29, 'pixel_gold', 'SINCE AN ACCIDENT', 5);
        this.runtimeClock = this.add.bitmapText(game.config.width / 2, 21, 'pixel_gold', '00:00:00', 10).setOrigin(0.5);
        this.startTime;

        // Inventory assets
        this.add.image(game.config.width / 2, game.config.height / 2 + 26, 'play_atlas', 'deco_inventory');
        this.add.image(game.config.width / 2, 65, 'play_atlas', 'deco_inventory_top');
        this.inventory = new Inventory(this, 3, 4).setOrigin(0.5);
        this.cursor = new Cursor(this.inventory);
        this.endOGame = false;

        // Input/Output setup
        this.add.image(280, 110, 'play_atlas', 'bg_invoice');                                 // input box visual
        this.inputSpace = new InputTile(this, 279, 113).setOrigin(0.5);                       // input item
        this.inTimerFrame = this.add.image(283, 150, 'play_atlas', 'deco_progress_bar');      // Timer bar background
        this.inTimerFrame = this.add.image(283, 150, 'play_atlas', 'progress_bar');
        this.inputTimer = this.add.rectangle(259, 150, 30, 4, 0xFFAA3B).setOrigin(0, 0.5);    // Timer bar

        this.add.image(45, 110, 'play_atlas', 'bg_orders');                                   // output box visual
        this.outputSpace = new OutputTile(this, 44, 106).setOrigin(0.5);                      // output item
        this.outTimerFrame = this.add.image(46, 150, 'play_atlas', 'deco_progress_bar');      // Timer bar background
        this.outTimerFrame = this.add.image(46, 150, 'play_atlas', 'progress_bar');
        this.outputTimer = this.add.rectangle(22, 150, 30, 4, 0xFFAA3B).setOrigin(0, 0.5);    // Timer bar

        // Movement Setup  
        keyLeft.on("down", () => {
            this.moveCursor(false, false);
        });
        keyLeft.on("up", () => {             // delay work anim for a bit, resume idle after inactivity
            this.goblinAnim();
        });

        keyRight.on("down", () => {
            this.moveCursor(false, true);
        });
        keyRight.on("up", () => {
            this.goblinAnim();
        });

        keyUp.on("down", () => {
            this.moveCursor(true, false);
        });
        keyUp.on("up", () => {
            this.goblinAnim();
        });

        keyDown.on("down", () => {
            this.moveCursor(true, true);
        });
        keyDown.on("up", () => {
            this.goblinAnim();
        });

        // C to pull from input
        keyInput.on("down", () => {
            if (!this.endOGame) {
                if (!this.cursor.heldStack) {
                    if(this.inputSpace.curItem) {
                        if(this.inputSpace.pull(this.cursor)) {
                            this.sound.play("push_n_pull", soundConfigs.input_pull);
                        }
                    } else {
                        console.log("No stack to pull");
                        this.wrongMove();
                    }
                } else {
                    this.wrongMove();
                    console.warn("Cannot pull or push while holding an item");
                }
            }
        });

        // X to pick up, put down
        keySelect.on("down", () => {
            if (!this.endOGame) {
                if (this.cursor.heldStack) {
                    let curSize = this.cursor.heldStack.curSize;
                    this.cursor.dropStack();
                    if (!this.cursor.heldStack || this.cursor.heldStack.curSize < curSize) {
                        this.sound.play("drop_stack", soundConfigs.drop_stack);
                    }
                } else {
                    let pickedUp = this.cursor.pickUpStack();
                    if (pickedUp) {
                        this.sound.play("pick_up_stack", soundConfigs.pick_up_stack);
                    }
                }
            }
        });
        // Z to push to output
        keyOutput.on("down", () => {
            if (!this.endOGame) {
                if (!this.cursor.heldStack) {
                    if(this.outputSpace.requestedItem) {
                        this.inventory.pushStack(this.cursor.coordinates.y, this.cursor.coordinates.x, this.outputSpace);
                        this.sound.play("push_n_pull", soundConfigs.output_push);
                        if (!this.outputSpace.requestedItem) {
                            customer.setVisible(false);
                        }
                    } else {
                        this.wrongMove();
                        console.log("No Item Requested");
                    }
                } else {
                    this.wrongMove();
                    console.warn("Cannot pull or push while holding an item");
                }
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
                    // Getting item index
                    let itemIndex;
                    do {
                        itemIndex = Math.floor(Math.random() * itemSpecs.length);
                    } while (itemSpecs[itemIndex].unlockLvl > this.playerLevel);

                    // Getting item stack size
                    let stackSize = Math.ceil(Math.random() * (itemSpecs[itemIndex].maxSize * gameSettings.levelUp.stackSizePortions[this.playerLevel - itemSpecs[itemIndex].unlockLvl]));

                    // Creating the item
                    this.inputSpace.createItem(stackSize, itemIndex);
                    this.inItemTween = this.addTween(this.inputSpace.curItem, "inOutItem");
                    this.sound.play("create", soundConfigs.create);
                    console.log("Item Created");
                } else {
                    this.endGame("Input backlog", this.inputSpace.x, this.inputSpace.y);
                }
            }
        });

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
                    if (this.inventory.isEmpty()) {
                        // Fail-safe to avoid infinite loop
                        if (this.inputSpace.curItem) {
                            itemIndex = itemSpecs.findIndex(elem => elem.textureName == this.inputSpace.curItem.name);
                            countInInventory = this.inputSpace.curItem.curSize;
                        } else {
                            console.error("Error: Request made before items spawned");
                            this.endGame("Sh*tty Game Design");
                        }
                    } else {
                        do {
                            itemIndex = Math.floor(Math.random() * itemSpecs.length);
                        } while (this.inventory.itemCount[itemSpecs[itemIndex].textureName] <= 0);
                        countInInventory = this.inventory.itemCount[itemSpecs[itemIndex].textureName];
                    }

                    let maxStackSize = itemSpecs[itemIndex].maxSize;

                    let maxRequestSize = (maxStackSize < countInInventory) ? maxStackSize : countInInventory;
                    let stackSize = Math.ceil(Math.random() * maxRequestSize);
                    this.outputSpace.createRequest(stackSize, itemIndex);
                    this.requestTween = this.addTween(this.outputSpace.requestedItem, "inOutItem");
                    this.sound.play("request", soundConfigs.request);
                    console.log("Request Created");
                    customer.setVisible(true);
                } else {
                    this.endGame("Output backlog", this.outputSpace.x, this.outputSpace.y);
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
            this.requestCurve.paused = false;
        });

        // Increasing player level
        // (Dependency on stack size increase and item unlocks)
        this.playerLevel = 0;
        this.levelUp = this.time.addEvent({
            delay: gameSettings.timings.leveling * 1000,
            repeat: gameSettings.levelUp.maxLevel,
            callback: () => { console.warn("Level Up"); this.playerLevel++ }
        });

        // Background music
        this.soundtrack = this.sound.add("BGM", soundConfigs.BGM);
        this.soundtrack.play();
    }

    /**
     * Wobbles the cursor and plays a sound to indicate an incorrect move
     */
    wrongMove() {
        this.addTween(this.cursor, "invalidMove");
        this.sound.play("wrong", soundConfigs.wrong);
    }

    /**
     * Handles cursor movement and associated sounds and animations
     * 
     * @param {boolean} isVertical – Whether or not the move is vertical
     * @param {boolean} isPositive – Whether or not the movement is in a positive direction (down or right)
     */
    moveCursor(isVertical, isPositive) {
        if (this.cursor.move(isVertical, isPositive)) {
            this.sound.play("move", soundConfigs.move);
            this.goblin_idle.setVisible(false);
            this.goblin_work.setVisible(true);
        }
    }

    /**
     * Adds the goblin animation
     */
    goblinAnim() {
        this.time.addEvent({ delay: 2000, callback: () => { this.goblin_work.setVisible(false); }, loop: true });
        this.time.addEvent({ delay: 2000, callback: () => { this.goblin_idle.setVisible(true); }, loop: true });
    }

    /**
     * Adds a tween to the scene
     * 
     * @param {Phaser.GameObjects.Sprite} target – The sprite the tween will be applied to
     * @param {Number} cfgIndex – The index in {@link tweenConfigs} corresponding to the desired tween
     * @param {Object} mods – Any modifications to be made to the base tween
     * @returns the tween
     */
    addTween(target, cfgIndex, mods) {
        let config = Object.assign({}, tweenConfigs[cfgIndex]);
        config.targets = target;
        if(mods) {
            for(let x in mods){
                config[x] = mods[x];
            }
        }

        // All tweens for this project have to do with scale, tint, xor position
        if (config.scale) {
            config.onStop = () => target.setScale(1);
        }
        return this.add.tween(config);
    }

    /**
     * Stops and removes the specified tween
     * 
     * @param {Phaser.Tweens.Tween} tween – The tween to be removed
     */
    removeTween(tween) {
        tween.stop();
        tween.remove();
    }

    /**
     * 
     * @param {string} cause – Name of cause of defeat
     * @param {Number} zoomX – Zoom X coordinate
     * @param {Number} zoomY – Zoom Y coordinate
     */
    endGame(cause, zoomX, zoomY) {
        // Player feedback
        console.log(`Death from ${cause}`);
        endCause = cause;
        endTime = this.runtimeClock.text;
        this.sound.play("death", soundConfigs.death);
        let zoomDuration = 0;
        let totalDuration = gameSettings.endingSequence.thinkTime * 1000;

        // Clock movement
        if (zoomX != undefined && zoomY != undefined) {
            zoomDuration = gameSettings.endingSequence.duration * 1000;
            let { ease, force, zoom } = gameSettings.endingSequence.zoom;
            this.cameras.main.pan(zoomX, zoomY, zoomDuration, ease, force);
            this.cameras.main.zoomTo(zoom, zoomDuration, ease, force);
        }
        totalDuration += zoomDuration;

        // Stop Gameplay
        this.endOGame = true;
        this.soundtrack.stop();
        this.time.removeAllEvents();
        this.tweens.killAll();

        // Ending clock
        this.time.delayedCall(totalDuration, () => {
            this.scene.start('end');
            this.startTime = undefined;
        });
    }

    update() {
        if (this.endOGame) {
            return;
        }

        // Sets startTime to time at first update
        if (!this.startTime) {
            this.startTime = this.time.now;
        }

        // Update input timer
        let curInputTimer;
        if (this.inputGen.paused) {
            curInputTimer = this.inputDelay;
        } else {
            curInputTimer = this.inputGen;
        }
        this.inputTimer.width = curInputTimer.getOverallProgress() * this.inTimerFrame.width;

        // Update output timer
        let curOutputTimer;
        if (this.outputGen.paused) {
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

    /**
     * Adds a leading 0 to 1-digit numbers
     * 
     * @param {Number} time – The number to be formatted
     * @returns the formatted number as a string
     */
    formatTimeText(time) {
        return (time < 10) ? `0${time}` : time;
    }
}