export default class DimensionalBarrier {

    constructor(scene, player, x, y, width, height, options = {}) {

        this.scene = scene;
        this.player = player;

        this.dimension = options.dimension ?? 'shared';

        this.gameObject = scene.add.rectangle(
            x,
            y,
            width,
            height,
            0x9b59ff
        );

        this.gameObject.setStrokeStyle(
            2,
            0xd8b4fe
        );

        scene.physics.add.existing(
            this.gameObject,
            true
        );

        this.body = this.gameObject.body;

        this.collider = scene.physics.add.collider(
            player.gameObject,
            this.gameObject,
            null,
            () => !player.movementAbilities.isDashing
        );

        if (!scene.dimensionalBarriers) {
            scene.dimensionalBarriers = [];
        }

        scene.dimensionalBarriers.push(this);

        scene.dimensionManager.register(
            this.gameObject,
            this.dimension
        );
    }

    resolvePlayerAfterDash() {

        const playerBody = this.player.body;
        const barrierBody = this.body;

        const isOverlapping =
            playerBody.right > barrierBody.left &&
            playerBody.left < barrierBody.right &&
            playerBody.bottom > barrierBody.top &&
            playerBody.top < barrierBody.bottom;

        if (!isOverlapping) {
            return;
        }

        const separationPadding = 1;

        const leftDistance =
            playerBody.right -
            barrierBody.left +
            separationPadding;

        const rightDistance =
            barrierBody.right -
            playerBody.left +
            separationPadding;

        let targetBodyX;

        if (leftDistance <= rightDistance) {

            targetBodyX =
                barrierBody.left -
                playerBody.width -
                separationPadding;

        } else {

            targetBodyX =
                barrierBody.right +
                separationPadding;

        }

        const displacement = targetBodyX - playerBody.left;

        this.player.gameObject.x += displacement;

        playerBody.updateFromGameObject();

        playerBody.setVelocityX(0);
        playerBody.setAccelerationX(0);
    }

    destroy() {

        this.collider.destroy();

        this.gameObject.destroy();

        this.scene.dimensionalBarriers =
            this.scene.dimensionalBarriers.filter(
                barrier => barrier !== this
            );
    }

}