
export default {

    id: 'level02',

    name: 'Between the Layers',

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

        // Zona inicial
        {
            id: 'starting_ground',
            type: 'platform',
            x: 40,
            y: 250,
            width: 80,
            height: 40,
            dimension: 'shared'
        },

        // Primera plataforma - Aether
        {
            id: 'platform_01',
            type: 'platform',
            x: 125,
            y: 210,
            width: 48,
            height: 12,
            dimension: 'aether'
        },

        // Segunda plataforma - Umbra
        {
            id: 'platform_02',
            type: 'platform',
            x: 195,
            y: 175,
            width: 48,
            height: 12,
            dimension: 'umbra'
        },

        // Tercera plataforma - Aether
        {
            id: 'platform_03',
            type: 'platform',
            x: 265,
            y: 140,
            width: 48,
            height: 12,
            dimension: 'aether'
        },

        // Cuarta plataforma - Umbra
        {
            id: 'platform_04',
            type: 'platform',
            x: 350,
            y: 105,
            width: 64,
            height: 12,
            dimension: 'umbra'
        },

        // Interruptor permanente
        {
            id: 'pressure_main',
            type: 'pressureSwitch',
            x: 350,
            y: 94,
            dimension: 'umbra',
            options: {
                mode: 'latch'
            }
        },

        // Puerta que bloquea el camino
        {
            id: 'main_gate',
            type: 'wall',
            x: 410,
            y: 120,
            width: 16,
            height: 220,
            dimension: 'shared'
        },

        // Zona segura después de la puerta
        {
            id: 'exit_ground',
            type: 'platform',
            x: 450,
            y: 250,
            width: 60,
            height: 40,
            dimension: 'shared'
        }

    ],

    goal: {

        x: 450,
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
                switches: ['pressure_main']
            }
        }

    ]

};
