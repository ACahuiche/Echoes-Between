import AbilityManager from '../abilities/AbilityManager.js';
import MovementAbilities from '../abilities/MovementAbilities.js';
import DimensionalAbilities from '../abilities/DimensionalAbilities.js';

export default class Player {

    constructor(scene, x, y) {

        this.scene = scene;

        this.speed = 180;
        this.acceleration = 1400;
        this.friction = 1800;
        this.jumpForce = -400;

        // Dirección: 1 = derecha, -1 = izquierda
        this.facing = 1;

        this.gameObject = scene.add.rectangle(
            x,
            y,
            24,
            32,
            0x00aaff
        );

        scene.physics.add.existing(this.gameObject);

        this.body = this.gameObject.body;

        this.body.setCollideWorldBounds(true);
        this.body.setMaxVelocity(this.speed, 1000);
        this.body.setDragX(this.friction);

        this.abilityManager = new AbilityManager();

        this.movementAbilities = new MovementAbilities(
            this,
            this.abilityManager
        );

        this.dimensionalAbilities = new DimensionalAbilities(
            this,
            this.abilityManager
        );

        this.cursors = scene.input.keyboard.createCursorKeys();

        this.keys = scene.input.keyboard.addKeys({
            a: 'A',
            d: 'D',
            dash: 'CTRL',
            glide: 'C',
            pulse: 'F',
            echo: 'Q'
        });
    }

    update() {
        this.movementAbilities.handleDash(this.keys.dash);

        if (!this.movementAbilities.isDashing) {

            this.handleMovement();

            this.movementAbilities.handleJump(
                this.cursors.space
            );
        }
    }

    handleMovement() {

        const body = this.body;

        let direction = 0;
    
        const movingLeft =
            this.cursors.left.isDown || this.keys.a.isDown;
    
        const movingRight =
            this.cursors.right.isDown || this.keys.d.isDown;
    
        if (movingLeft && !movingRight) {
            direction = -1;
        }
    
        if (movingRight && !movingLeft) {
            direction = 1;
        }
    
        if (direction !== 0) {
            this.facing = direction;
        }
    
        const isWallGrabbing =
            this.movementAbilities.handleWallGrab(direction);
    
        if (isWallGrabbing) {
            body.setAccelerationX(0);
            body.setVelocityX(0);
            return;
        }
    
        body.setAccelerationX(
            direction * this.acceleration
        );
    
        body.setMaxVelocity(this.speed, 1000);

    }

}