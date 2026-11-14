
export default {

    id: 'level01',

    name: 'El principio',

    playerSpawn: {
        x: 40,
        y: 210
    },

    dimensions: {

        initial: 'aether',

        backgrounds: {
            aether: '#163b48',
            umbra: '#291638'
        }

    },

    objects: [
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
            id: 'platform_01',
            type: 'platform',
            x: 115,
            y: 200,
            width: 64,
            height: 12,
            dimension: 'shared'
        },
        {
            id: 'platform_03',
            type: 'platform',
            x: 260,
            y: 120,
            width: 64,
            height: 12,
            dimension: 'shared'
        },
        {
            id: 'main_gate',
            type: 'wall',
            x: 350,
            y: 120,
            width: 16,
            height: 220,
            dimension: 'shared'
        },
        {
            id: 'pressure_main',
            type: 'pressureSwitch',
            x: 260,
            y: 110,
            dimension: 'shared',
            options: {
                mode: 'latch'
            }
        }

    ],

    goal: {

        x: 440,
        y: 210,

        options: {
            width: 12,
            height: 40,
            color: 0xffc857
        }

    },

    mechanisms: [

        {
            id: 'main_gate_control',
            type: 'switchGate',
            target: 'main_gate',

            conditions: {
                mode: 'momentary',

                switches: [
                    'pressure_main'
                ]
            }
        }

    ]

};
