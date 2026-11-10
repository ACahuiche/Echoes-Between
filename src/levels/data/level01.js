
export default {

    id: 'level01',

    name: 'The First Shift',

    playerSpawn: {
        x: 80,
        y: 180
    },

    dimensions: {

        initial: 'aether',

        backgrounds: {
            aether: '#163b48',
            umbra: '#291638'
        }

    },

    objects: [

        // =====================================
        // SHARED ENVIRONMENT
        // =====================================

        {
            id: 'main_ground',
            type: 'platform',
            x: 240,
            y: 250,
            width: 480,
            height: 40,
            dimension: 'shared'
        },

        {
            id: 'umbra_barrier',
            type: 'dimensionalBarrier',
            x: 220,
            y: 120,
            width: 16,
            height: 220,
            dimension: 'shared'
        },

        {
            id: 'main_wall',
            type: 'wall',
            x: 320,
            y: 120,
            width: 16,
            height: 220,
            dimension: 'shared'
        },

        // =====================================
        // AETHER ENVIRONMENT
        // =====================================

        {
            id: 'aether_platform1',
            type: 'platform',
            x: 150,
            y: 170,
            width: 100,
            height: 12,
            dimension: 'aether'
        },

        {
            id: 'aether_platform2',
            type: 'platform',
            x: 100,
            y: 120,
            width: 100,
            height: 12,
            dimension: 'aether'
        },

        // =====================================
        // UMBRA ENVIRONMENT
        // =====================================

        {
            id: 'umbra_platform',
            type: 'platform',
            x: 370,
            y: 185,
            width: 100,
            height: 12,
            dimension: 'umbra'
        },

        // =====================================
        // PULSE SWITCHES
        // =====================================

        /*
        {
            id: 'switch_aether',
            type: 'pulseSwitch',
            x: 120,
            y: 180,
            dimension: 'aether',
            options: {
                type: 'permanent'
            }
        },

        {
            id: 'switch_umbra',
            type: 'pulseSwitch',
            x: 165,
            y: 180,
            dimension: 'umbra',
            options: {
                type: 'permanent'
            }
        },

        {
            id: 'switch_shared',
            type: 'pulseSwitch',
            x: 80,
            y: 160,
            dimension: 'shared',
            options: {
                type: 'temporary',
                duration: 3000
            }
        },

        {
            id: 'switch_umbra_upper',
            type: 'pulseSwitch',
            x: 220,
            y: 100,
            dimension: 'umbra',
            options: {
                type: 'permanent'
            }
        },
        */

        // =====================================
        // PRESSURE SWITCHES
        // =====================================

        {
            id: 'pressure_aether',
            type: 'pressureSwitch',
            x: 120,
            y: 110,
            dimension: 'aether',
            options: {
                mode: 'momentary'
            }
        },

        {
            id: 'pressure_umbra',
            type: 'pressureSwitch',
            x: 350,
            y: 175,
            dimension: 'umbra',
            options: {
                mode: 'momentary'
            }
        }

    ],

    // =====================================
    // MECHANISMS
    // =====================================

    mechanisms: [

        {
            id: 'main_wall_control_aether',
            type: 'switchGate',
            target: 'main_wall',
    
            conditions: {
                mode: 'momentary',
    
                switches: [
                    'pressure_aether'
                ]
            }
        },
    
        {
            id: 'main_wall_control_umbra',
            type: 'switchGate',
            target: 'main_wall',
    
            conditions: {
                mode: 'momentary',
    
                switches: [
                    'pressure_umbra'
                ]
            }
        }
    
    ]

};
