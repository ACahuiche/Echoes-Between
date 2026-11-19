
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

        this.createAnimation();
    }

    createAnimation() {

        const scene = this.player.scene;

        if (scene.anims.exists('wanderer-echo')) {
            return;
        }

        scene.anims.create({
            key: 'wanderer-echo',
            frames: scene.anims.generateFrameNumbers(
                'wanderer',
                { start: 13, end: 15 }
            ),
            frameRate: 3,
            repeat: -1
        });
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

        this.gameObject = this.player.scene.add.sprite(
            playerBody.center.x,
            playerBody.center.y,
            'wanderer',
            13
        );

        this.gameObject.setOrigin(
            playerObject.originX,
            playerObject.originY
        );

        this.gameObject.setScale(
            playerObject.scaleX,
            playerObject.scaleY
        );

        this.gameObject.setFlipX(
            playerObject.flipX
        );

        this.gameObject.setAlpha(0.45);

        this.gameObject.setDepth(
            playerObject.depth + 1
        );

        this.gameObject.play('wanderer-echo');

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
