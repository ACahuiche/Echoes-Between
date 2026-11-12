
export default {

    id: 'level05',

    name: 'La Ruptura Dimensional',

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

        // Suelo principal de todo el nivel.
        {
            id: 'main_ground',
            type: 'platform',
            x: 240,
            y: 250,
            width: 480,
            height: 40,
            dimension: 'shared'
        },

        // Barrera dimensional que bloquea el camino.
        {
            id: 'dimensional_barrier',
            type: 'dimensionalBarrier',
            x: 240,
            y: 115,
            width: 24,
            height: 230,
            dimension: 'shared'
        },

        // Coleccionable situado en la parte superior
        // izquierda de la barrera.
        {
            id: 'dimensional_dash_pickup',
            type: 'abilityPickup',
            ability: 'dimensionalDash',
            x: 10,
            y: 25,
            dimension: 'shared',
            options: {
                width: 16,
                height: 20,
                color: 0xffc857
            }
        }

    ],

    // Goal al otro lado de la barrera.
    goal: {

        x: 430,
        y: 210,

        options: {
            width: 12,
            height: 40,
            color: 0xffc857
        }

    },

    mechanisms: []

};
