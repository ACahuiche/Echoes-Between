
import Phaser from 'phaser';

export default class DimensionManager {

    constructor(scene) {

        this.scene = scene;

        this.currentDimension = 'aether';

        this.player = null;

        this.objects = [];

        this.backgrounds = {
            aether: '#163b48',
            umbra: '#291638'
        };

        this.scene.cameras.main.setBackgroundColor(
            this.backgrounds[this.currentDimension]
        );
    }

    setPlayer(player) {
        this.player = player;
    }

    register(gameObject, dimension = 'shared') {

        const entry = {
            gameObject,
            dimension
        };

        // Indica si algún mecanismo ha abierto este objeto.
        if (gameObject.mechanismOpen === undefined) {
            gameObject.mechanismOpen = false;
        }

        this.objects.push(entry);

        this.applyObjectState(entry);

        return entry;
    }

    applyObjectState(entry) {

        const gameObject = entry.gameObject;

        // Comprueba si el objeto pertenece a la dimensión actual.
        const isDimensionActive =
            entry.dimension === 'shared' ||
            entry.dimension === this.currentDimension;

        // Comprueba si algún mecanismo abrió el objeto.
        const isOpen = gameObject.mechanismOpen ?? false;

        // El objeto solo está disponible si pertenece
        // a la dimensión actual y no está abierto.
        const isAvailable =
            isDimensionActive && !isOpen;

        gameObject.setVisible(isAvailable);

        if (gameObject.body) {
            gameObject.body.enable = isAvailable;
        }
    }

    handleInput(shiftKey) {

        if (!Phaser.Input.Keyboard.JustDown(shiftKey)) {
            return;
        }

        this.switchDimension();
    }

    switchDimension() {

        const nextDimension =
            this.currentDimension === 'aether'
                ? 'umbra'
                : 'aether';

        if (!this.canEnterDimension(nextDimension)) {
            console.log('Dimensional shift blocked');
            return false;
        }

        this.currentDimension = nextDimension;

        for (const entry of this.objects) {
            this.applyObjectState(entry);
        }

        this.scene.cameras.main.setBackgroundColor(
            this.backgrounds[this.currentDimension]
        );

        console.log(
            `Current dimension: ${this.currentDimension}`
        );

        return true;
    }

    canEnterDimension(dimension) {

        if (!this.player) {
            return true;
        }

        const playerBody = this.player.body;

        const playerBounds = new Phaser.Geom.Rectangle(
            playerBody.x,
            playerBody.y,
            playerBody.width,
            playerBody.height
        );

        for (const entry of this.objects) {

            if (
                entry.dimension === 'shared' ||
                entry.dimension !== dimension
            ) {
                continue;
            }

            const gameObject = entry.gameObject;

            // Los objetos abiertos ya no representan obstáculos.
            if (gameObject.mechanismOpen) {
                continue;
            }

            const body = gameObject.body;

            if (!body) {
                continue;
            }

            const obstacleBounds = new Phaser.Geom.Rectangle(
                body.x,
                body.y,
                body.width,
                body.height
            );

            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    playerBounds,
                    obstacleBounds
                )
            ) {
                return false;
            }
        }

        return true;
    }

}
