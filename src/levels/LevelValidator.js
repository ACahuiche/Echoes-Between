
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

const VALID_MECHANISM_TYPES = [
    'switchGate'
];

const VALID_CONDITION_MODES = [
    'all',
    'any',
    'latch',
    'momentary'
];

export default class LevelValidator {

    static validate(levelData) {

        const errors = [];
        const ids = new Set();
        const switchIds = new Set();

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
                errors.push(
                    'Player spawn requires valid x and y coordinates'
                );
            }

        }

        if (!levelData.dimensions) {
            errors.push('Level must define dimensions');
        } else {

            const initial = levelData.dimensions.initial;

            if (!['aether', 'umbra'].includes(initial)) {
                errors.push(
                    'Initial dimension must be aether or umbra'
                );
            }

        }

        if (!Array.isArray(levelData.objects)) {

            errors.push('Level objects must be an array');

        } else {

            levelData.objects.forEach((object, index) => {

                const prefix = `Object at index ${index}`;

                if (!VALID_OBJECT_TYPES.includes(object.type)) {
                    errors.push(
                        `${prefix}: invalid type "${object.type}"`
                    );
                }

                if (
                    !Number.isFinite(object.x) ||
                    !Number.isFinite(object.y)
                ) {
                    errors.push(
                        `${prefix}: valid x and y coordinates are required`
                    );
                }

                const dimension = object.dimension ?? 'shared';

                if (!VALID_DIMENSIONS.includes(dimension)) {
                    errors.push(
                        `${prefix}: invalid dimension "${dimension}"`
                    );
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
                        errors.push(
                            `${prefix}: valid positive width and height are required`
                        );
                    }

                }

                if (object.id) {

                    if (ids.has(object.id)) {
                        errors.push(
                            `${prefix}: duplicate id "${object.id}"`
                        );
                    }

                    ids.add(object.id);

                    if (
                        object.type === 'pressureSwitch' ||
                        object.type === 'pulseSwitch'
                    ) {
                        switchIds.add(object.id);
                    }

                }

                if (object.type === 'pressureSwitch') {

                    const mode = object.options?.mode ?? 'momentary';

                    if (!['momentary', 'toggle', 'latch'].includes(mode)) {
                        errors.push(
                            `${prefix}: invalid pressure switch mode "${mode}"`
                        );
                    }

                }

                if (object.type === 'pulseSwitch') {

                    const type = object.options?.type ?? 'permanent';

                    if (!['permanent', 'temporary'].includes(type)) {
                        errors.push(
                            `${prefix}: invalid pulse switch type "${type}"`
                        );
                    }

                    const duration = object.options?.duration ?? 2000;

                    if (!Number.isFinite(duration) || duration <= 0) {
                        errors.push(
                            `${prefix}: pulse switch duration must be positive`
                        );
                    }

                }

            });

        }

        if (levelData.mechanisms !== undefined) {

            if (!Array.isArray(levelData.mechanisms)) {

                errors.push('Level mechanisms must be an array');

            } else {

                const mechanismIds = new Set();

                levelData.mechanisms.forEach((mechanism, index) => {

                    const prefix = `Mechanism at index ${index}`;

                    if (!mechanism.id) {
                        errors.push(`${prefix}: id is required`);
                    }

                    if (mechanism.id) {

                        if (
                            ids.has(mechanism.id) ||
                            mechanismIds.has(mechanism.id)
                        ) {
                            errors.push(
                                `${prefix}: duplicate id "${mechanism.id}"`
                            );
                        }

                        mechanismIds.add(mechanism.id);

                    }

                    if (!VALID_MECHANISM_TYPES.includes(mechanism.type)) {
                        errors.push(
                            `${prefix}: invalid type "${mechanism.type}"`
                        );
                    }

                    if (!ids.has(mechanism.target)) {
                        errors.push(
                            `${prefix}: target "${mechanism.target}" does not exist`
                        );
                    }

                    if (
                        !mechanism.conditions ||
                        !VALID_CONDITION_MODES.includes(
                            mechanism.conditions.mode
                        )
                    ) {
                        errors.push(
                            `${prefix}: invalid or missing condition mode`
                        );

                        return;
                    }

                    const switchReferences = mechanism.conditions.switches;

                    if (
                        !Array.isArray(switchReferences) ||
                        switchReferences.length === 0
                    ) {
                        errors.push(
                            `${prefix}: at least one switch is required`
                        );

                        return;
                    }

                    switchReferences.forEach(switchId => {

                        if (!switchIds.has(switchId)) {
                            errors.push(
                                `${prefix}: switch "${switchId}" does not exist or is not a switch`
                            );
                        }

                    });

                });

            }

        }

        return errors;

    }

}
