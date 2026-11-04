import Phaser from 'phaser';
import { ABILITY_CONFIG } from '../config/abilityConfig.js';

export default class MovementAbilities {

    constructor(player, abilityManager) {

        this.player = player;
        this.abilityManager = abilityManager;

        this.jumpCount = 0;

        this.isDashing = false;
        this.dashTimer = null;

        this.isGliding = false;

        this.canWallJump = true;
    }

    handleJump(jumpKey) {

        const body = this.player.body;

        const touchingLeft =
            body.blocked.left || body.touching.left;

        const touchingRight =
            body.blocked.right || body.touching.right;

        const wallDirection = touchingLeft
            ? 1
            : touchingRight
                ? -1
                : 0;

        if (body.onFloor()) {

            this.jumpCount = 0;
            this.canWallJump = true;

        } else if (wallDirection === 0) {

            this.canWallJump = true;

        }

        if (!Phaser.Input.Keyboard.JustDown(jumpKey)) {
            return;
        }

        const hasWallJump =
            this.abilityManager.isUnlocked('wallJump');

        if (hasWallJump && this.canWallJump && wallDirection !== 0) {

            const config = ABILITY_CONFIG.wallJump;

            body.setAccelerationX(0);

            body.setVelocity(
                wallDirection * config.horizontalForce,
                config.verticalForce
            );

            this.player.facing = wallDirection;

            this.jumpCount = 1;
            this.canWallJump = false;

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