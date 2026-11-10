const VALID_DIMENSIONS = [
    'shared',
    'aether',
    'umbra'
];

const VALID_OBJECT_TYPES = [
    'platform',
    'wall',
    'dimensionalBarrier',
    'pulseSwitch',
    'pressureSwitch'
];

export default class LevelValidator {

    static validate(levelData) {

        const errors = [];

        if (!levelData || typeof levelData !== 'object') {
            return ['Level data must be an object'];
        }

        if (!levelData.id) {
            errors.push('Level must have an id');
        }

        if (!levelData.playerSpawn) {
            errors.push('Level must define playerSpawn');
        } else {

            const { x, y } = levelData.playerSpawn;

            if (!Number.isFinite(x) || !Number.isFinite(y)) {
                errors.push('Player spawn requires valid x and y coordinates');
            }
        }

        if (!levelData.dimensions) {
            errors.push('Level must define dimensions');
        } else {

            const initial = levelData.dimensions.initial;

            if (!['aether', 'umbra'].includes(initial)) {
                errors.push('Initial dimension must be aether or umbra');
            }
        }

        if (!Array.isArray(levelData.objects)) {
            errors.push('Level objects must be an array');
        } else {

            const ids = new Set();

            levelData.objects.forEach((object, index) => {

                const prefix = `Object at index ${index}`;

                if (!VALID_OBJECT_TYPES.includes(object.type)) {
                    errors.push(`${prefix}: invalid type "${object.type}"`);
                }

                if (
                    !Number.isFinite(object.x) ||
                    !Number.isFinite(object.y)
                ) {
                    errors.push(`${prefix}: valid x and y coordinates are required`);
                }

                const dimension = object.dimension ?? 'shared';

                if (!VALID_DIMENSIONS.includes(dimension)) {
                    errors.push(`${prefix}: invalid dimension "${dimension}"`);
                }

                if (
                    ['platform', 'wall', 'dimensionalBarrier'].includes(object.type)
                ) {

                    if (
                        !Number.isFinite(object.width) ||
                        !Number.isFinite(object.height) ||
                        object.width <= 0 ||
                        object.height <= 0
                    ) {
                        errors.push(`${prefix}: valid positive width and height are required`);
                    }
                }

                if (object.id) {

                    if (ids.has(object.id)) {
                        errors.push(`${prefix}: duplicate id "${object.id}"`);
                    }

                    ids.add(object.id);
                }

            });
        }

        return errors;
    }

}