
import { ABILITY_CONFIG } from '../config/abilityConfig.js';

export default class AetherGlide {

    constructor(player, abilityManager) {

        this.player = player;
        this.abilityManager = abilityManager;

        this.isActive = false;

        this.currentLevel = this.abilityManager.getLevel('aetherGlide');

        this.maxDuration = this.getDurationForLevel(
            this.currentLevel
        );

        this.remainingTime = this.maxDuration;
    }

    getDurationForLevel(level) {

        const durations =
            ABILITY_CONFIG.aetherGlide.durations;

        const duration = durations[level - 1];

        return duration === null
            ? Infinity
            : duration;
    }

    syncLevel() {

        const level = this.abilityManager.getLevel('aetherGlide');

        if (level === this.currentLevel) {
            return;
        }

        this.currentLevel = level;

        this.maxDuration = this.getDurationForLevel(level);

        this.remainingTime = Math.min(
            this.remainingTime,
            this.maxDuration
        );
    }

    update(glideKey, isWallGrabbing, isDashing, delta) {

        const body = this.player.body;

        this.syncLevel();

        if (!this.abilityManager.isUnlocked('aetherGlide')) {
            this.deactivate();
            return;
        }

        if (body.onFloor()) {

            this.remainingTime = this.maxDuration;

            this.deactivate();

            return;
        }

        if (isWallGrabbing || isDashing) {
            this.deactivate();
            return;
        }

        if (body.velocity.y < 0) {
            this.deactivate();
            return;
        }

        if (!glideKey.isDown) {
            this.deactivate();
            return;
        }

        if (this.remainingTime <= 0) {
            this.deactivate();
            return;
        }

        this.activate();

        const fallSpeed =
            ABILITY_CONFIG.aetherGlide.fallSpeed;

        body.setMaxVelocity(
            body.maxVelocity.x,
            fallSpeed
        );

        if (body.velocity.y > fallSpeed) {
            body.setVelocityY(fallSpeed);
        }

        if (this.remainingTime !== Infinity) {

            this.remainingTime -= Math.max(0, delta);

            if (this.remainingTime <= 0) {

                this.remainingTime = 0;

                this.deactivate();
            }
        }
    }

    activate() {
        this.isActive = true;
    }

    deactivate() {

        if (!this.isActive) {
            return;
        }

        this.isActive = false;

        const body = this.player.body;

        body.setMaxVelocity(
            body.maxVelocity.x,
            1000
        );
    }

}
