class Play extends Phaser.Scene {

    constructor() {
        super("play");
    }

    create() {
        console.log("play");

        // Input Setup
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyInput = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        keySelect = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyOutput = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // Game World Setup
        this.inventory = new Inventory(this, 4, 5).setOrigin(0.5);
        this.cursor = new Cursor(this.inventory);
        this.cursor.setDepth(1);
        this.cursor.setOrigin(0.5);

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
        keyInput.on("down", () => {
            console.log("Pull from input");
        });
        keySelect.on("down", () => {
            if(this.cursor.heldStack) {
                this.cursor.dropStack();
            } else {
                this.cursor.pickUpStack();
            }
        });
        keyOutput.on("down", () => {
            console.log("Push to Output");
        });

        // Test item
        this.testItem = new ItemStack(this.inventory, 1, 1, "item");
        this.testItem.setOrigin(0.5);
        this.testItem.setDepth(0.5);
    }
}