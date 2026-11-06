import Phaser from 'phaser';

export default class PulseSwitch {

    constructor(scene, x, y, width = 16, height = 16, options = {}) {

        this.scene = scene;

        this.type = options.type ?? 'permanent';

        this.duration = options.duration ?? 2000;

        this.dimension = options.dimension ?? 'shared';

        this.isActive = false;

        this.activationTimer = null;

        this.gameObject = scene.add.rectangle(
            x,
            y,
            width,
            height,
            0x777777
        );

        this.gameObject.setStrokeStyle(2, 0xffffff);

        this.bounds = this.gameObject.getBounds();

        if (!this.scene.pulseSwitches) {
            this.scene.pulseSwitches = [];
        }

        this.scene.pulseSwitches.push(this);

        this.scene.dimensionManager.register(
            this.gameObject,
            this.dimension
        );
    }

    getDistanceFrom(x, y) {

        const bounds = this.gameObject.getBounds();

        const closestX = Phaser.Math.Clamp(
            x,
            bounds.left,
            bounds.right
        );

        const closestY = Phaser.Math.Clamp(
            y,
            bounds.top,
            bounds.bottom
        );

        return Math.hypot(
            x - closestX,
            y - closestY
        );
    }

    activate() {

        if (this.type === 'permanent' && this.isActive) {
            return;
        }

        this.isActive = true;

        const activeColor = this.type === 'temporary'
            ? 0x65cfff
            : 0x00ff88;

        this.gameObject.setFillStyle(activeColor);

        if (this.type === 'temporary') {

            if (this.activationTimer) {
                this.activationTimer.remove();
            }

            this.activationTimer = this.scene.time.delayedCall(
                this.duration,
                () => {
                    this.deactivate();
                }
            );
        }

        console.log(`${this.type} switch activated`);
    }

    deactivate() {

        if (!this.isActive) {
            return;
        }

        this.isActive = false;

        this.gameObject.setFillStyle(0x777777);

        this.activationTimer = null;

        console.log(`${this.type} switch deactivated`);
    }

    destroy() {

        if (this.activationTimer) {
            this.activationTimer.remove();
        }

        this.scene.pulseSwitches =
            this.scene.pulseSwitches.filter(
                pulseSwitch => pulseSwitch !== this
            );

        this.gameObject.destroy();
    }

}