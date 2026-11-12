
export default class AbilityPickup {

    constructor(scene, player, x, y, abilityName, options = {}) {

        this.scene = scene;
        this.player = player;
        this.abilityName = abilityName;
        this.collected = false;

        this.dimension = options.dimension ?? 'shared';

        const width = options.width ?? 16;
        const height = options.height ?? 20;
        const color = options.color ?? 0xffc857;

        this.gameObject = scene.add.rectangle(
            x,
            y,
            width,
            height,
            color
        );

        this.gameObject.setStrokeStyle(2, 0xffedaa);
        this.gameObject.setDepth(5);

        scene.physics.add.existing(this.gameObject, true);

        // Registrar el coleccionable en el sistema dimensional.
        scene.dimensionManager.register(
            this.gameObject,
            this.dimension
        );

        scene.physics.add.overlap(
            player.gameObject,
            this.gameObject,
            this.collect,
            () => this.gameObject.body.enable,
            this
        );
    }

    collect() {

        if (this.collected) return;

        const abilityManager = this.player.abilityManager;

        if (abilityManager.isUnlocked(this.abilityName)) {
            return;
        }

        const unlocked = abilityManager.unlock(this.abilityName);

        if (!unlocked) return;

        this.collected = true;

        this.gameObject.destroy();

        this.scene.events.emit(
            'ability-unlocked',
            this.abilityName
        );

    }

    destroy() {

        this.gameObject.destroy();

    }

}
