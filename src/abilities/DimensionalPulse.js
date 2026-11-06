import Phaser from 'phaser';

import { ABILITY_CONFIG } from '../config/abilityConfig.js';

export default class DimensionalPulse {

    constructor(player, abilityManager) {

        this.player = player;
        this.scene = player.scene;
        this.abilityManager = abilityManager;

        this.isActive = false;

        this.elapsedTime = 0;
        this.currentRadius = 0;
        this.previousRadius = 0;

        this.origin = {
            x: 0,
            y: 0
        };

        this.graphics = null;

        this.reachedSwitches = new Set();

        this.config = ABILITY_CONFIG.dimensionalPulse;
    }

    handleInput(pulseKey) {

        if (!this.abilityManager.isUnlocked('dimensionalPulse')) {
            return;
        }

        if (this.isActive) {
            return;
        }

        if (!Phaser.Input.Keyboard.JustDown(pulseKey)) {
            return;
        }

        this.start();
    }

    start() {

        if (this.isActive) {
            return;
        }

        this.isActive = true;

        this.elapsedTime = 0;
        this.currentRadius = 0;
        this.previousRadius = 0;

        this.reachedSwitches.clear();

        this.origin.x = this.player.gameObject.x;
        this.origin.y = this.player.gameObject.y;

        this.graphics = this.scene.add.graphics();

        this.graphics.setDepth(10);
    }

    update(delta) {

        if (!this.isActive) {
            return;
        }

        this.previousRadius = this.currentRadius;

        this.elapsedTime += delta;

        const progress = Phaser.Math.Clamp(
            this.elapsedTime / this.config.duration,
            0,
            1
        );

        this.currentRadius =
            this.config.radius * progress;

        this.draw();

        this.detectSwitches();

        if (progress >= 1) {
            this.finish();
        }
    }

    draw() {

        this.graphics.clear();

        this.graphics.lineStyle(
            this.config.lineWidth,
            this.config.color,
            this.config.alpha
        );

        this.graphics.strokeCircle(
            this.origin.x,
            this.origin.y,
            this.currentRadius
        );
    }

    detectSwitches() {

        const switches = this.scene.pulseSwitches || [];

        const reachedThisFrame = [];

        for (const pulseSwitch of switches) {

            if (this.reachedSwitches.has(pulseSwitch)) {
                continue;
            }

            const distance = pulseSwitch.getDistanceFrom(
                this.origin.x,
                this.origin.y
            );

            if (distance <= this.currentRadius) {

                reachedThisFrame.push({
                    pulseSwitch,
                    distance
                });
            }
        }

        reachedThisFrame.sort(
            (a, b) => a.distance - b.distance
        );

        for (const entry of reachedThisFrame) {

            this.reachedSwitches.add(entry.pulseSwitch);

            entry.pulseSwitch.activate();
        }
    }

    finish() {

        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }

        this.isActive = false;

        this.elapsedTime = 0;
        this.currentRadius = 0;
        this.previousRadius = 0;

        this.reachedSwitches.clear();
    }

}