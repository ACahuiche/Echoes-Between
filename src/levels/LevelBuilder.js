
import LevelValidator from './LevelValidator.js';
import LevelObjectFactory from './LevelObjectFactory.js';
import MechanismManager from '../mechanisms/MechanismManager.js';

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

        this.mechanismManager = null;

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

        // Registrar mecanismos después de crear todos los objetos.
        this.mechanismManager = new MechanismManager(
            this.scene,
            this.objectsById,
            levelData.mechanisms ?? []
        );

        console.log(
            `Level loaded: ${levelData.name ?? levelData.id}`
        );

        console.log(
            `Objects created: ${this.objects.length}`
        );

        console.log(
            `Mechanisms created: ${this.mechanismManager.mechanisms.length}`
        );

        return {
            id: levelData.id,
            name: levelData.name,
            objects: this.objects,
            objectsById: this.objectsById,
            playerSpawn: levelData.playerSpawn,
            mechanismManager: this.mechanismManager
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
