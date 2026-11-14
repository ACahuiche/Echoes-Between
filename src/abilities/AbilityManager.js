
import {
    TEST_CONFIG,
    ABILITY_CONFIG
} from '../config/abilityConfig.js';

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

        this.abilityLevels = {
            aetherGlide: 1
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

    getLevel(abilityName) {

        return this.abilityLevels[abilityName] ?? 1;

    }

    setLevel(abilityName, level) {

        if (!(abilityName in this.abilityLevels)) {
            return false;
        }

        const maxLevel =
            ABILITY_CONFIG.aetherGlide.maxLevel;

        if (
            !Number.isInteger(level) ||
            level < 1 ||
            level > maxLevel
        ) {
            return false;
        }

        this.abilityLevels[abilityName] = level;

        console.log(`${abilityName} upgraded to level ${level}`);

        return true;

    }

    upgrade(abilityName) {

        if (!(abilityName in this.abilityLevels)) {
            return false;
        }

        const currentLevel = this.getLevel(abilityName);

        const maxLevel =
            ABILITY_CONFIG.aetherGlide.maxLevel;

        if (currentLevel >= maxLevel) {
            return false;
        }

        return this.setLevel(
            abilityName,
            currentLevel + 1
        );

    }

    getUnlockedAbilities() {

        return Object.keys(this.unlockedAbilities)
            .filter(ability => this.isUnlocked(ability));

    }

    getProgress() {

        return {

            unlockedAbilities: {
                ...this.unlockedAbilities
            },

            abilityLevels: {
                ...this.abilityLevels
            }

        };

    }

    restoreProgress(progress) {

        if (!progress || typeof progress !== 'object') {
            return false;
        }

        if (progress.unlockedAbilities) {

            Object.keys(this.unlockedAbilities).forEach(ability => {

                const unlocked =
                    progress.unlockedAbilities[ability];

                if (typeof unlocked === 'boolean') {

                    this.unlockedAbilities[ability] = unlocked;

                }

            });

        }

        if (progress.abilityLevels) {

            Object.keys(this.abilityLevels).forEach(ability => {

                const level = progress.abilityLevels[ability];

                if (level !== undefined) {

                    this.setLevel(ability, level);

                }

            });

        }

        console.log(
            'Ability progress restored:',
            this.getProgress()
        );

        return true;

    }

}
