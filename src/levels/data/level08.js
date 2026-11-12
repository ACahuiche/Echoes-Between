
export default {

    id: 'level08',

    name: 'El Último Reflejo',

    playerSpawn: {
        x: 65,
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

        // Plataforma principal izquierda.
        {
            id: 'starting_platform',
            type: 'platform',
            x: 110,
            y: 250,
            width: 220,
            height: 40,
            dimension: 'shared'
        },

        // Plataforma elevada con el interruptor.
        {
            id: 'switch_platform',
            type: 'platform',
            x: 120,
            y: 190,
            width: 100,
            height: 12,
            dimension: 'shared'
        },

        // Interruptor que debe permanecer presionado.
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

        // Coleccionable que desbloquea Temporal Echo.
        {
            id: 'temporal_echo_pickup',
            type: 'abilityPickup',
            ability: 'temporalEcho',
            x: 10,
            y: 20,
            dimension: 'umbra',
            options: {
                width: 16,
                height: 20,
                color: 0xffc857
            }
        },

        // Pared central que se abre mientras
        // el interruptor permanece presionado.
        {
            id: 'echo_gate',
            type: 'wall',
            x: 260,
            y: 135,
            width: 16,
            height: 230,
            dimension: 'shared'
        },

        // Plataforma derecha para llegar al Goal.
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
        y: 210,

        options: {
            width: 12,
            height: 40,
            color: 0xffc857
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
