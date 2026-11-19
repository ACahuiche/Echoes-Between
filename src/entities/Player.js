
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
        this.jumpAnimationStarted = false;

        this.moveDirection = 0;

        this.gameObject = scene.physics.add.sprite(
            x,
            y,
            'wanderer',
            0
        );

        this.gameObject.setOrigin(0.5, 0.5);
        this.gameObject.setScale(2);

        this.body = this.gameObject.body;

        this.body.setSize(24, 28);
        this.body.setOffset(4, 4);

        this.createAnimations();

        this.gameObject.on(
            'animationcomplete-wanderer-jump-start',
            () => {

                if (
                    !this.body.onFloor() &&
                    this.jumpAnimationStarted &&
                    !this.movementAbilities.isWallGrabbing &&
                    !this.movementAbilities.performedWallJump
                ) {
                    this.gameObject.play('wanderer-jump-loop');
                }
            }
        );

        this.body.setCollideWorldBounds(false);
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

        this.scene.dimensionManager?.handleInput(
            this.keys.shift
        );

        this.movementAbilities.handleDash(
            this.keys.dash
        );

        if (!this.movementAbilities.isDashing) {

            this.handleMovement();

            this.movementAbilities.handleJump(
                this.cursors.space
            );

        } else {

            this.moveDirection = 0;
        }

        this.aetherGlide.update(
            this.keys.glide,
            this.movementAbilities.isWallGrabbing,
            this.movementAbilities.isDashing,
            delta
        );

        this.dimensionalPulse.handleInput(
            this.keys.pulse
        );

        this.dimensionalPulse.update(delta);

        this.temporalEcho.handleInput(
            this.keys.echo
        );

        this.updateAnimation();
    }

    createAnimations() {

        if (!this.scene.anims.exists('wanderer-walk')) {
            this.scene.anims.create({
                key: 'wanderer-walk',
                frames: this.scene.anims.generateFrameNumbers(
                    'wanderer',
                    { start: 0, end: 3 }
                ),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('wanderer-jump-start')) {
            this.scene.anims.create({
                key: 'wanderer-jump-start',
                frames: this.scene.anims.generateFrameNumbers(
                    'wanderer',
                    { start: 4, end: 5 }
                ),
                frameRate: 8,
                repeat: 0
            });
        }

        if (!this.scene.anims.exists('wanderer-jump-loop')) {
            this.scene.anims.create({
                key: 'wanderer-jump-loop',
                frames: this.scene.anims.generateFrameNumbers(
                    'wanderer',
                    { start: 6, end: 7 }
                ),
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('wanderer-wall-grab')) {
            this.scene.anims.create({
                key: 'wanderer-wall-grab',
                frames: [
                    { key: 'wanderer', frame: 8 }
                ],
                frameRate: 1,
                repeat: 0
            });
        }

        if (!this.scene.anims.exists('wanderer-wall-jump')) {
            this.scene.anims.create({
                key: 'wanderer-wall-jump',
                frames: this.scene.anims.generateFrameNumbers(
                    'wanderer',
                    { start: 9, end: 10 }
                ),
                frameRate: 8,
                repeat: -1
            });
        }
    }

    handleMovement() {

        const body = this.body;
        let direction = 0;

        const movingLeft =
            this.cursors.left.isDown ||
            this.keys.a.isDown;

        const movingRight =
            this.cursors.right.isDown ||
            this.keys.d.isDown;

        if (movingLeft && !movingRight) {
            direction = -1;
        }

        if (movingRight && !movingLeft) {
            direction = 1;
        }

        this.moveDirection = direction;

        if (direction !== 0) {
            this.facing = direction;
        }

        const isWallGrabbing =
            this.movementAbilities.handleWallGrab(direction);

        if (isWallGrabbing) {

            body.setAccelerationX(0);
            body.setVelocityX(0);

            this.moveDirection = 0;

            return;
        }

        body.setAccelerationX(
            direction * this.acceleration
        );

        body.setMaxVelocity(this.speed, 1000);
    }

    updateAnimation() {

        const body = this.body;
        const movement = this.movementAbilities;

        const currentAnimation =
            this.gameObject.anims.currentAnim?.key;

        const isOnFloor = body.onFloor();

        // Wall Grab
        if (movement.isWallGrabbing) {

            this.facing = movement.wallGrabDirection;

            this.gameObject.setFlipX(
                this.facing === -1
            );

            this.jumpAnimationStarted = true;

            this.gameObject.anims.stop();
            this.gameObject.setFrame(8);

            return;
        }

        // En el aire
        if (!isOnFloor) {

            // Wall Jump
            if (movement.performedWallJump) {

                const directionTowardWall =
                    -movement.wallJumpPushDirection;

                // Wall Jump mirando hacia la pared
                if (
                    this.moveDirection === directionTowardWall
                ) {

                    this.facing = directionTowardWall;

                    this.gameObject.setFlipX(
                        this.facing === -1
                    );

                    if (
                        currentAnimation !== 'wanderer-wall-jump' ||
                        !this.gameObject.anims.isPlaying
                    ) {
                        this.gameObject.play(
                            'wanderer-wall-jump'
                        );
                    }

                    return;
                }

                // Wall Jump alejándose de la pared
                this.gameObject.setFlipX(
                    this.facing === -1
                );

                if (
                    currentAnimation !== 'wanderer-jump-loop' ||
                    !this.gameObject.anims.isPlaying
                ) {
                    this.gameObject.play(
                        'wanderer-jump-loop'
                    );
                }

                return;
            }

            // Salto normal: preparación
            if (!this.jumpAnimationStarted) {

                this.jumpAnimationStarted = true;

                this.gameObject.setFlipX(
                    this.facing === -1
                );

                this.gameObject.play(
                    'wanderer-jump-start'
                );

                return;
            }

            // Salto normal: caída
            if (
                currentAnimation !== 'wanderer-jump-start' &&
                (
                    currentAnimation !== 'wanderer-jump-loop' ||
                    !this.gameObject.anims.isPlaying
                )
            ) {
                this.gameObject.play(
                    'wanderer-jump-loop'
                );
            }

            this.gameObject.setFlipX(
                this.facing === -1
            );

            return;
        }

        // Al aterrizar
        this.jumpAnimationStarted = false;

        this.gameObject.setFlipX(
            this.facing === -1
        );

        // Caminando
        if (this.moveDirection !== 0) {

            if (
                currentAnimation !== 'wanderer-walk' ||
                !this.gameObject.anims.isPlaying
            ) {
                this.gameObject.play(
                    'wanderer-walk'
                );
            }

            return;
        }

        // Idle
        this.gameObject.anims.stop();
        this.gameObject.setFrame(0);
    }

}
