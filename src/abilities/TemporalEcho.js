
import Phaser from 'phaser';
import { ABILITY_CONFIG } from '../config/abilityConfig.js';

export default class TemporalEcho {

    constructor(player, abilityManager) {

        this.player = player;
        this.abilityManager = abilityManager;

        this.gameObject = null;
        this.echoTimer = null;

        this.duration =
            ABILITY_CONFIG.temporalEcho.duration;
    }

    handleInput(echoKey) {

        if (!this.abilityManager.isUnlocked('temporalEcho')) {
            return;
        }

        if (!Phaser.Input.Keyboard.JustDown(echoKey)) {
            return;
        }

        if (this.gameObject) {
            return;
        }

        this.createEcho();
    }

    createEcho() {

        const playerBody = this.player.body;
        const playerObject = this.player.gameObject;

        this.gameObject = this.player.scene.add.rectangle(
            playerBody.center.x,
            playerBody.center.y,
            playerBody.width,
            playerBody.height,
            0x65cfff,
            0.45
        );

        this.gameObject.setStrokeStyle(
            2,
            0x65cfff,
            0.8
        );

        this.gameObject.setDepth(
            playerObject.depth + 1
        );

        this.echoTimer = this.player.scene.time.delayedCall(
            this.duration,
            () => {
                this.destroyEcho();
            }
        );

        console.log('Temporal Echo created');
    }

    destroyEcho() {

        if (!this.gameObject) {
            return;
        }

        this.gameObject.destroy();

        this.gameObject = null;
        this.echoTimer = null;

        console.log('Temporal Echo disappeared');
    }

    destroy() {

        if (this.echoTimer) {
            this.echoTimer.remove();
            this.echoTimer = null;
        }

        if (this.gameObject) {
            this.gameObject.destroy();
            this.gameObject = null;
        }
    }

}
