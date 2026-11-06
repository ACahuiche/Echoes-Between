import AbilityManager from '../abilities/AbilityManager.js';
import MovementAbilities from '../abilities/MovementAbilities.js';
import DimensionalAbilities from '../abilities/DimensionalAbilities.js';
import AetherGlide from '../abilities/AetherGlide.js';
import DimensionalPulse from '../abilities/DimensionalPulse.js';
import TemporalEcho from '../abilities/TemporalEcho.js';

export default class Player {

    constructor(scene, x, y) {

        this.scene = scene;

        this.speed = 180;
        this.acceleration = 1400;
        this.friction = 1800;
        this.jumpForce = -400;

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

        this.aetherGlide = new AetherGlide(
            this,
            this.abilityManager
        );

        this.dimensionalPulse = new DimensionalPulse(
            this,
            this.abilityManager
        );

        this.temporalEcho = new TemporalEcho(
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
            echo: 'Q',
            shift: 'SHIFT'
        });
    }

    update(delta = this.scene.game.loop.delta) {

        // Cambio dimensional: SHIFT.
        this.scene.dimensionManager?.handleInput(
            this.keys.shift
        );

        this.movementAbilities.handleDash(this.keys.dash);

        if (!this.movementAbilities.isDashing) {

            this.handleMovement();

            this.movementAbilities.handleJump(
                this.cursors.space
            );
        }

        this.aetherGlide.update(
            this.keys.glide,
            this.movementAbilities.isWallGrabbing,
            this.movementAbilities.isDashing,
            delta
        );

        this.dimensionalPulse.handleInput(this.keys.pulse);

        this.dimensionalPulse.update(delta);

        this.temporalEcho.handleInput(this.keys.echo);
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