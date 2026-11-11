import DimensionalBarrier from '../objects/DimensionalBarrier.js';
import PulseSwitch from '../objects/PulseSwitch.js';
import PressureSwitch from '../objects/PressureSwitch.js';
import AbilityPickup from '../objects/AbilityPickup.js';

export default class LevelObjectFactory {

    constructor(scene, player, dimensionManager) {

        this.scene = scene;
        this.player = player;
        this.dimensionManager = dimensionManager;

    }

    create(objectData) {

        const dimension = objectData.dimension ?? 'shared';

        let createdObject;

        switch (objectData.type) {

            case 'platform':
            case 'wall':

                createdObject = this.createSolid(objectData, dimension);

                break;

            case 'dimensionalBarrier':

                createdObject = new DimensionalBarrier(
                    this.scene,
                    this.player,
                    objectData.x,
                    objectData.y,
                    objectData.width,
                    objectData.height,
                    {
                        ...objectData.options,
                        dimension
                    }
                );

                break;

            case 'abilityPickup':

                createdObject = new AbilityPickup(
                    this.scene,
                    this.player,
                    objectData.x,
                    objectData.y,
                    objectData.ability,
                    objectData.options ?? {}
                );

                break;

            case 'pulseSwitch':

                createdObject = new PulseSwitch(
                    this.scene,
                    objectData.x,
                    objectData.y,
                    objectData.width ?? 16,
                    objectData.height ?? 16,
                    {
                        ...objectData.options,
                        dimension
                    }
                );

                break;

            case 'pressureSwitch':

                createdObject = new PressureSwitch(
                    this.scene,
                    objectData.x,
                    objectData.y,
                    objectData.width ?? 24,
                    objectData.height ?? 8,
                    {
                        ...objectData.options,
                        dimension
                    }
                );

                break;

            default:

                throw new Error(
                    `Unknown level object type: ${objectData.type}`
                );
        }

        return createdObject;
    }

    createSolid(objectData, dimension) {

        const defaultColor = {
            shared: 0x777777,
            aether: 0x38c6c8,
            umbra: 0x9b59ff
        };

        const color =
            objectData.color ?? defaultColor[dimension];

        const gameObject = this.scene.add.rectangle(
            objectData.x,
            objectData.y,
            objectData.width,
            objectData.height,
            color
        );

        this.scene.physics.add.existing(
            gameObject,
            true
        );

        this.scene.physics.add.collider(
            this.player.gameObject,
            gameObject
        );

        this.dimensionManager.register(
            gameObject,
            dimension
        );

        return gameObject;
    }

}