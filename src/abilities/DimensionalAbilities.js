export default class DimensionalAbilities {

    constructor(player, abilityManager) {

        this.player = player;
        this.abilityManager = abilityManager;

        this.temporalEcho = null;
        this.echoTimer = null;
    }

    canUse(abilityName) {

        return this.abilityManager.isUnlocked(abilityName);
    }

}