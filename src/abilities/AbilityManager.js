import { TEST_CONFIG } from '../config/abilityConfig.js';

export default class AbilityManager {

    constructor() {

        this.testConfig = TEST_CONFIG;

        this.unlockedAbilities = {

            doubleJump: false,
            dimensionalDash: false,
            wallJump: false,
            aetherGlide: false,
            dimensionalPulse: false,
            temporalEcho: false

        };
    }

    isUnlocked(abilityName) {
        if (
            this.testConfig.enabled &&
            this.testConfig.unlockAllAbilities
        ) {
            return true;
        }

        return this.unlockedAbilities[abilityName] === true;
    }

    unlock(abilityName) {

        if (abilityName in this.unlockedAbilities) {

            this.unlockedAbilities[abilityName] = true;

            console.log(`Ability unlocked: ${abilityName}`);

            return true;
        }

        console.warn(`Unknown ability: ${abilityName}`);

        return false;
    }

    lock(abilityName) {

        if (abilityName in this.unlockedAbilities) {

            this.unlockedAbilities[abilityName] = false;

            return true;
        }

        return false;
    }

    getUnlockedAbilities() {

        return Object.keys(this.unlockedAbilities)
            .filter(ability => this.isUnlocked(ability));
    }

}