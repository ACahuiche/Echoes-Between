
import Phaser from 'phaser';

export default class Goal {

    constructor(scene, player, x, y, options = {}) {

        this.scene = scene;
        this.player = player;
        this.reached = false;

        const width = options.width ?? 12;
        const height = options.height ?? 40;
        const color = options.color ?? 0xffc857;

        this.gameObject = scene.add.rectangle(
            x, y, width, height, color
        );

        this.gameObject.setStrokeStyle(2, 0xffedaa);
        this.gameObject.setDepth(5);

        scene.physics.add.existing(this.gameObject, true);

        scene.physics.add.overlap(
            player.gameObject,
            this.gameObject,
            this.handleOverlap,
            undefined,
            this
        );
    }

    handleOverlap() {
        if (this.reached) return;

        this.reached = true;
        this.gameObject.setFillStyle(0xffffff);
        this.scene.events.emit('goal-reached');
    }

    destroy() {
        this.gameObject.destroy();
    }
}
