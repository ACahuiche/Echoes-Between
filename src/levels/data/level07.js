
export default {

    id: 'level07',

    name: 'El Pulso del Cambio',

    playerSpawn: {
        x: 40,
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
            id: 'main_ground',
            type: 'platform',
            x: 240,
            y: 250,
            width: 480,
            height: 40,
            dimension: 'shared'
        },
        {
            id: 'dimensional_pulse_pickup',
            type: 'abilityPickup',
            ability: 'dimensionalPulse',
            x: 150,
            y: 210,
            dimension: 'shared',
            options: {
                width: 16,
                height: 20,
                scale: 2
            }
        },
        {
            id: 'pulse_gate',
            type: 'wall',
            x: 240,
            y: 46,
            width: 16,
            height: 370,
            dimension: 'shared'
        },
        {
            id: 'pulse_switch_main',
            type: 'pulseSwitch',
            x: 275,
            y: 150,
            dimension: 'shared',
            options: {
                type: 'permanent'
            }
        }

    ],
    goal: {

        x: 440,
        y: 167,

        options: {
            width: 60,
            height: 110,
            scale: 2,
        }

    },

    mechanisms: [
        {
            id: 'pulse_gate_control',
            type: 'switchGate',
            target: 'pulse_gate',

            conditions: {
                mode: 'latch',

                switches: [
                    'pulse_switch_main'
                ]
            }
        }
    ]
};
