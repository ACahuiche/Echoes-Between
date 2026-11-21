
import Phaser from 'phaser';
import { ABILITY_CONFIG } from '../config/abilityConfig.js';

export default class MovementAbilities {

    constructor(player, abilityManager) {

        this.player = player;
        this.abilityManager = abilityManager;

        this.jumpCount = 0;

        this.isDashing = false;
        this.dashTimer = null;

        this.canWallJump = true;
        this.isWallGrabbing = false;
        this.performedWallJump = false;

        this.wallJumpPushDirection = 0;
        this.wallGrabDirection = 0;
    }

    handleWallGrab(direction) {

        const body = this.player.body;

        if (
            !this.abilityManager.isUnlocked('wallJump') ||
            body.onFloor() ||
            this.isDashing ||
            !this.canWallJump
        ) {

            this.isWallGrabbing = false;
            this.wallGrabDirection = 0;

            return false;
        }

        // Si ya está agarrado, conservar el estado
        // sin depender de la colisión de cada frame.
        if (this.isWallGrabbing) {

            if (direction === this.wallGrabDirection) {

                const fallSpeed =
                    ABILITY_CONFIG.wallJump.grabFallSpeed;

                if (body.velocity.y > fallSpeed) {
                    body.setVelocityY(fallSpeed);
                }

                body.setAccelerationX(0);
                body.setVelocityX(0);

                return true;
            }

            // Liberar cuando deja de presionar
            // hacia la pared.
            this.isWallGrabbing = false;
            this.wallGrabDirection = 0;

            return false;
        }

        // La colisión solamente se necesita
        // para iniciar el agarre.
        const touchingLeft =
            body.blocked.left || body.touching.left;

        const touchingRight =
            body.blocked.right || body.touching.right;

        const pressingTowardWall =
            (touchingLeft && direction === -1) ||
            (touchingRight && direction === 1);

        if (!pressingTowardWall) {
            return false;
        }

        // Registrar el agarre.
        this.isWallGrabbing = true;
        this.wallGrabDirection = direction;

        const fallSpeed =
            ABILITY_CONFIG.wallJump.grabFallSpeed;

        if (body.velocity.y > fallSpeed) {
            body.setVelocityY(fallSpeed);
        }

        body.setAccelerationX(0);
        body.setVelocityX(0);

        return true;
    }

    handleJump(jumpKey) {

        const body = this.player.body;

        const touchingLeft =
            body.blocked.left || body.touching.left;

        const touchingRight =
            body.blocked.right || body.touching.right;

        let wallDirection = touchingLeft
            ? 1
            : touchingRight
                ? -1
                : 0;

        // Si está agarrado, usar la pared registrada
        // aunque Phaser pierda el contacto este frame.
        if (
            wallDirection === 0 &&
            this.isWallGrabbing
        ) {
            wallDirection = -this.wallGrabDirection;
        }

        if (body.onFloor()) {

            this.jumpCount = 0;
            this.canWallJump = true;
            this.performedWallJump = false;
            this.wallJumpPushDirection = 0;

            this.isWallGrabbing = false;
            this.wallGrabDirection = 0;

        } else if (wallDirection === 0) {

            this.canWallJump = true;
        }

        if (!Phaser.Input.Keyboard.JustDown(jumpKey)) {
            return;
        }

        const hasWallJump =
            this.abilityManager.isUnlocked('wallJump');

        if (
            hasWallJump &&
            this.canWallJump &&
            wallDirection !== 0
        ) {

            const config = ABILITY_CONFIG.wallJump;

            body.setAccelerationX(0);

            body.setVelocity(
                wallDirection * config.horizontalForce,
                config.verticalForce
            );

            this.player.facing = wallDirection;

            this.jumpCount = 1;
            this.canWallJump = false;

            this.isWallGrabbing = false;
            this.wallGrabDirection = 0;

            this.performedWallJump = true;
            this.wallJumpPushDirection = wallDirection;

            return;
        }

        const hasDoubleJump =
            this.abilityManager.isUnlocked('doubleJump');

        const maxJumps = hasDoubleJump
            ? ABILITY_CONFIG.doubleJump.maxJumps
            : 1;

        if (this.jumpCount < maxJumps) {

            body.setVelocityY(this.player.jumpForce);
            this.jumpCount++;
        }
    }

    hasPerformedDoubleJump() {

        return (
            this.abilityManager.isUnlocked('doubleJump') &&
            this.jumpCount >= 2
        );
    }

    hasPerformedWallJump() {
        return this.performedWallJump;
    }

    handleDash(dashKey) {

        if (!this.abilityManager.isUnlocked('dimensionalDash')) {
            return;
        }

        if (this.isDashing) {
            return;
        }

        if (!Phaser.Input.Keyboard.JustDown(dashKey)) {
            return;
        }

        const body = this.player.body;
        const config = ABILITY_CONFIG.dimensionalDash;

        this.isDashing = true;

        this.isWallGrabbing = false;
        this.wallGrabDirection = 0;

        body.setAccelerationX(0);
        body.setDragX(0);

        body.setMaxVelocity(config.speed, 1000);

        body.setVelocityX(
            this.player.facing * config.speed
        );

        this.dashTimer = this.player.scene.time.delayedCall(
            config.duration,
            () => {

                this.isDashing = false;

                body.setVelocityX(0);
                body.setDragX(this.player.friction);

                body.setMaxVelocity(
                    this.player.speed,
                    1000
                );

                const barriers =
                    this.player.scene.dimensionalBarriers || [];

                barriers.forEach(barrier => {
                    barrier.resolvePlayerAfterDash();
                });

                this.dashTimer = null;
            }
        );
    }
}
