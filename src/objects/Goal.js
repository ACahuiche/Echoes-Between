
import Phaser from 'phaser';

export default class Goal {

    constructor(scene, player, x, y, options = {}) {

        this.scene = scene;
        this.player = player;
        this.reached = false;

        const scale = options.scale ?? 2;

        const width = options.width ?? 28;
        const height = options.height ?? 60;

        this.gameObject = scene.add.sprite(
            x,
            y,
            'portal',
            0
        );

        this.gameObject.setOrigin(0.5, 0.5);
        this.gameObject.setScale(scale);
        this.gameObject.setAngle(options.rotation ?? 0);
        this.gameObject.setDepth(5);

        this.createAnimation();

        this.gameObject.play('portal-idle');

        scene.physics.add.existing(
            this.gameObject,
            true
        );

        this.gameObject.body.setSize(
            width,
            height,
            true
        );

        scene.physics.add.overlap(
            player.gameObject,
            this.gameObject,
            this.handleOverlap,
            undefined,
            this
        );
    }

    createAnimation() {

        if (this.scene.anims.exists('portal-idle')) {
            return;
        }

        this.scene.anims.create({
            key: 'portal-idle',
            frames: this.scene.anims.generateFrameNumbers(
                'portal',
                { start: 0, end: 3 }
            ),
            frameRate: 5,
            repeat: -1
        });
    }

    handleOverlap() {

        if (this.reached) {
            return;
        }

        this.reached = true;

        this.gameObject.setTint(0xffffff);

        this.scene.events.emit('goal-reached');
    }

    destroy() {

        if (this.gameObject) {
            this.gameObject.destroy();
        }
    }

}
