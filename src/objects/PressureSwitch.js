import Phaser from 'phaser';

export default class PressureSwitch {

    constructor(scene, x, y, width = 24, height = 8, options = {}) {

        this.scene = scene;

        this.dimension = options.dimension ?? 'shared';

        this.isPressed = false;

        this.gameObject = scene.add.rectangle(
            x,
            y,
            width,
            height,
            0x777777
        );

        this.gameObject.setStrokeStyle(
            2,
            0xffffff
        );

        if (!scene.pressureSwitches) {
            scene.pressureSwitches = [];
        }

        scene.pressureSwitches.push(this);

        scene.dimensionManager.register(
            this.gameObject,
            this.dimension
        );
    }

    update(actors, currentDimension) {

        const isAvailable =
            this.dimension === 'shared' ||
            this.dimension === currentDimension;

        if (!isAvailable) {
            this.setPressed(false);
            return;
        }

        const switchBounds = this.gameObject.getBounds();

        const isPressed = actors.some(actor => {

            if (!actor || !actor.active) {
                return false;
            }

            const actorBounds = actor.getBounds();

            return Phaser.Geom.Intersects.RectangleToRectangle(
                switchBounds,
                actorBounds
            );
        });

        this.setPressed(isPressed);
    }

    setPressed(isPressed) {

        if (this.isPressed === isPressed) {
            return;
        }

        this.isPressed = isPressed;

        this.gameObject.setFillStyle(
            this.isPressed ? 0x65cfff : 0x777777
        );

        console.log(
            this.isPressed
                ? 'Pressure switch pressed'
                : 'Pressure switch released'
        );
    }

    destroy() {

        this.scene.pressureSwitches =
            this.scene.pressureSwitches.filter(
                pressureSwitch => pressureSwitch !== this
            );

        this.gameObject.destroy();
    }

}