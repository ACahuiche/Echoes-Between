import LevelValidator from './LevelValidator.js';
import LevelObjectFactory from './LevelObjectFactory.js';

export default class LevelBuilder {

    constructor(scene, player, dimensionManager) {

        this.scene = scene;
        this.player = player;
        this.dimensionManager = dimensionManager;

        this.objectFactory = new LevelObjectFactory(
            scene,
            player,
            dimensionManager
        );

        this.objects = [];
        this.objectsById = new Map();

    }

    build(levelData) {

        const errors = LevelValidator.validate(levelData);

        if (errors.length > 0) {

            throw new Error(
                `Invalid level "${levelData.id}":\n` +
                errors.map(error => `- ${error}`).join('\n')
            );
        }

        this.configureDimensions(levelData);

        this.player.gameObject.setPosition(
            levelData.playerSpawn.x,
            levelData.playerSpawn.y
        );

        for (const objectData of levelData.objects) {

            const createdObject =
                this.objectFactory.create(objectData);

            this.objects.push(createdObject);

            if (objectData.id) {
                this.objectsById.set(
                    objectData.id,
                    createdObject
                );
            }
        }

        console.log(
            `Level loaded: ${levelData.name ?? levelData.id}`
        );

        console.log(
            `Objects created: ${this.objects.length}`
        );

        return {
            id: levelData.id,
            name: levelData.name,
            objects: this.objects,
            objectsById: this.objectsById,
            playerSpawn: levelData.playerSpawn
        };
    }

    configureDimensions(levelData) {

        const dimensions = levelData.dimensions;

        this.dimensionManager.currentDimension =
            dimensions.initial;

        if (dimensions.backgrounds) {

            this.dimensionManager.backgrounds = {
                ...this.dimensionManager.backgrounds,
                ...dimensions.backgrounds
            };
        }

        this.scene.cameras.main.setBackgroundColor(
            this.dimensionManager.backgrounds[
                dimensions.initial
            ]
        );
    }

}