
export default class AbilityPickup {

    constructor(scene, player, x, y, abilityName, options = {}) {

        this.scene = scene;
        this.player = player;
        this.abilityName = abilityName;
        this.collected = false;

        this.dimension = options.dimension ?? 'shared';

        const scale = options.scale ?? 1;

        const animations = {
            doubleJump: 'pickup-doubleJump',
            wallJump: 'pickup-wallJump',
            dimensionalDash: 'pickup-dimensionalDash',
            aetherGlide: 'pickup-aetherGlide',
            dimensionalPulse: 'pickup-dimensionalPulse',
            temporalEcho: 'pickup-temporalEcho'
        };

        const animationKey = animations[abilityName];

        if (!animationKey) {

            throw new Error(
                `Unknown ability pickup: ${abilityName}`
            );

        }

        this.gameObject = scene.add.sprite(
            x,
            y,
            'abilities',
            0
        );

        this.gameObject.setScale(scale);
        this.gameObject.setDepth(5);

        this.gameObject.play(animationKey);

        scene.physics.add.existing(
            this.gameObject,
            true
        );

        const width = options.width ?? this.gameObject.width;
        const height = options.height ?? this.gameObject.height;

        this.gameObject.body.setSize(
            width,
            height,
            true
        );

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

        if (this.gameObject) {
            this.gameObject.destroy();
        }
    }

}
