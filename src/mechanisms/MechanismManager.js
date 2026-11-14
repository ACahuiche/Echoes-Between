
export default class MechanismManager {

    constructor(scene, objectsById, mechanismData = []) {

        this.scene = scene;
        this.objectsById = objectsById;
        this.mechanisms = [];

        for (const data of mechanismData) {
            this.register(data);
        }

    }

    register(data) {
        const target = this.objectsById.get(data.target);

        if (!target) {
            throw new Error(
                `Mechanism "${data.id}": target "${data.target}" not found`
            );
        }

        const gameObject = target.gameObject ?? target;

        if (!gameObject.body) {
            throw new Error(
                `Mechanism "${data.id}": target "${data.target}" has no physics body`
            );
        }

        this.mechanisms.push({
            id: data.id,
            type: data.type,
            target,
            gameObject,
            targetId: data.target,
            conditions: data.conditions,
            isOpen: false,
            wasConditionMet: false,
            isToggled: false
        });

    }

    update() {
        const targetStates = new Map();

        for (const mechanism of this.mechanisms) {

            const conditionMet =
                this.evaluateConditions(mechanism.conditions);

            let shouldOpen = false;

            switch (mechanism.conditions.mode) {

                case 'momentary':

                    shouldOpen = conditionMet;

                    break;

                case 'latch':

                    if (conditionMet) {
                        mechanism.isToggled = true;
                    }

                    shouldOpen = mechanism.isToggled;

                    break;

                case 'toggle':

                    if (
                        conditionMet &&
                        !mechanism.wasConditionMet
                    ) {
                        mechanism.isToggled =
                            !mechanism.isToggled;
                    }

                    shouldOpen = mechanism.isToggled;

                    break;

            }

            mechanism.wasConditionMet = conditionMet;

            mechanism.isOpen = shouldOpen;

            const currentState =
                targetStates.get(mechanism.targetId) ?? false;

            targetStates.set(
                mechanism.targetId,
                currentState || shouldOpen
            );

        }

        for (const mechanism of this.mechanisms) {

            const isOpen =
                targetStates.get(mechanism.targetId);

            this.applyState(mechanism, isOpen);

        }

    }


    evaluateConditions(conditions) {
        const switches = conditions.switches.map(id =>
            this.objectsById.get(id)
        );

        switch (conditions.mode) {

            case 'all':
                return switches.every(
                    pressureSwitch => pressureSwitch.isActive
                );

            case 'any':
            case 'momentary':
                return switches.some(
                    pressureSwitch => pressureSwitch.isActive
                );

            case 'latch':
                return switches.every(
                    pressureSwitch => pressureSwitch.hasBeenActivated
                );

            default:
                return false;

        }

    }

    applyState(mechanism, isOpen) {
        const gameObject = mechanism.gameObject;

        gameObject.mechanismOpen = isOpen;

        const dimensionEntry =
            this.scene.dimensionManager.objects.find(
                entry => entry.gameObject === gameObject
            );

        const dimensionActive =
            !dimensionEntry ||
            dimensionEntry.dimension === 'shared' ||
            dimensionEntry.dimension ===
            this.scene.dimensionManager.currentDimension;

        gameObject.setVisible(
            dimensionActive && !isOpen
        );

        gameObject.body.enable =
            dimensionActive && !isOpen;

    }

}
