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
    }

    handleJump(jumpKey) {

        const body = this.player.body;

        if (body.onFloor()) {
            this.jumpCount = 0;
        }

        if (!Phaser.Input.Keyboard.JustDown(jumpKey)) {
            return;
        }

        const hasDoubleJump = this.abilityManager.isUnlocked('doubleJump');

        const maxJumps = hasDoubleJump
            ? ABILITY_CONFIG.doubleJump.maxJumps
            : 1;

        if (this.jumpCount < maxJumps) {

            body.setVelocityY(this.player.jumpForce);

            this.jumpCount++;
        }
    }

}