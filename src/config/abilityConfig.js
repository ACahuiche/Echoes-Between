export const ABILITY_CONFIG = {
    doubleJump: {
        maxJumps: 2
    },

    dimensionalDash: {
        duration: 150,
        speed: 650
    },

    wallJump: {
        horizontalForce: 250,
        verticalForce: -400,
        grabFallSpeed: 80
    },

    aetherGlide: {
        fallSpeed: 120,
        durations: [
            5000,
            7000,
            null
        ],
        maxLevel: 3
    },

    dimensionalPulse: {
        radius: 96,
        duration: 500,
        lineWidth: 3,
        color: 0x65f5ff,
        alpha: 0.9
    },

    temporalEcho: {
        duration: 5000
    }
};

export const TEST_CONFIG = {
    enabled: true,
    unlockAllAbilities: false
};
