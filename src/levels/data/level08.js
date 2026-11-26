
export default {

    id: 'level08',

    name: 'El Último Reflejo',

    playerSpawn: {
        x: 50,
        y: 200
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
            id: 'starting_platform',
            type: 'platform',
            x: 110,
            y: 250,
            width: 220,
            height: 40,
            dimension: 'shared'
        },
        {
            id: 'left_climbing_wall',
            type: 'wall',
            x: 8,
            y: 135,
            width: 16,
            height: 270,
            dimension: 'shared'
        },
        {
            id: 'switch_platform',
            type: 'platform',
            x: 120,
            y: 190,
            width: 100,
            height: 12,
            dimension: 'shared'
        },
        {
            id: 'echo_pressure_switch',
            type: 'pressureSwitch',
            x: 120,
            y: 180,
            dimension: 'shared',
            options: {
                mode: 'momentary'
            }
        },
        {
            id: 'temporal_echo_pickup',
            type: 'abilityPickup',
            ability: 'temporalEcho',
            x: 25,
            y: 20,
            dimension: 'umbra',
            options: {
                width: 16,
                height: 20,
                scale: 2
            }
        },
        {
            id: 'echo_gate',
            type: 'wall',
            x: 260,
            y: 135,
            width: 16,
            height: 230,
            dimension: 'shared'
        },
        {
            id: 'goal_platform',
            type: 'platform',
            x: 400,
            y: 250,
            width: 160,
            height: 40,
            dimension: 'shared'
        }
    ],
    goal: {

        x: 430,
        y: 167,

        options: {
            width: 60,
            height: 110,
            scale: 2,
        }

    },
    mechanisms: [
        {
            id: 'echo_gate_control',
            type: 'switchGate',
            target: 'echo_gate',

            conditions: {
                mode: 'momentary',

                switches: [
                    'echo_pressure_switch'
                ]
            }
        }
    ]
};
