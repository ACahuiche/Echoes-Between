import Phaser from 'phaser';

export default class PressureSwitch {

    constructor(scene, x, y, width = 24, height = 8) {

        this.scene = scene;

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
    }

    update(actors) {

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