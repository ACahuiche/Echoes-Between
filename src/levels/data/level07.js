
export default {

    id: 'level07',

    name: 'El Pulso del Cambio',

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

        // Suelo principal.
        {
            id: 'main_ground',
            type: 'platform',
            x: 240,
            y: 250,
            width: 480,
            height: 40,
            dimension: 'shared'
        },

        // Coleccionable que desbloquea Dimensional Pulse.
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
                color: 0xffc857
            }
        },

        // Pared que bloquea el camino.
        {
            id: 'pulse_gate',
            type: 'wall',
            x: 240,
            y: 135,
            width: 16,
            height: 230,
            dimension: 'shared'
        },

        // Interruptor permanente detrás de la pared.
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

    // Goal al otro lado de la pared.
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
