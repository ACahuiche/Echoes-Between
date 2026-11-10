
import Phaser from 'phaser';

export default class PressureSwitch {

    constructor(scene, x, y, width = 24, height = 8, options = {}) {

        this.scene = scene;

        this.dimension = options.dimension ?? 'shared';

        // Modos: momentary, toggle, latch.
        this.mode = options.mode ?? 'momentary';

        const validModes = [
            'momentary',
            'toggle',
            'latch'
        ];

        if (!validModes.includes(this.mode)) {
            throw new Error(
                `Invalid PressureSwitch mode: ${this.mode}`
            );
        }

        // Estado físico.
        this.isPressed = false;

        // Estado lógico.
        this.isActive = false;

        // Registro histórico de activación.
        this.hasBeenActivated = false;

        // Evita alternancias mientras se mantiene presionado.
        this.wasPressed = false;

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

            this.isPressed = false;
            this.wasPressed = false;

            // Los momentáneos dejan de funcionar
            // al abandonar su dimensión.
            if (this.mode === 'momentary') {
                this.isActive = false;
            }

            this.updateVisuals();

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

        const justPressed =
            isPressed && !this.wasPressed;

        this.isPressed = isPressed;

        if (justPressed) {

            this.hasBeenActivated = true;

            switch (this.mode) {

                case 'momentary':

                    this.isActive = true;

                    break;

                case 'toggle':

                    this.isActive = !this.isActive;

                    break;

                case 'latch':

                    this.isActive = true;

                    break;

            }

            console.log(
                `Pressure switch activated: ${this.mode}`
            );

        }

        // El modo momentáneo sigue el estado físico.
        if (this.mode === 'momentary') {
            this.isActive = isPressed;
        }

        this.wasPressed = isPressed;

        this.updateVisuals();

    }

    updateVisuals() {

        let color = 0x777777;

        if (this.isActive) {

            switch (this.mode) {

                case 'momentary':
                    color = 0x65cfff;
                    break;

                case 'toggle':
                    color = 0x9b59ff;
                    break;

                case 'latch':
                    color = 0xffc857;
                    break;

            }

        }

        this.gameObject.setFillStyle(color);

    }

    destroy() {

        this.scene.pressureSwitches =
            this.scene.pressureSwitches.filter(
                pressureSwitch => pressureSwitch !== this
            );

        this.gameObject.destroy();

    }

}
