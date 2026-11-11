
export default {

    id: 'level03',

    name: 'The Second Leap',

    playerSpawn: {
        x: 20,
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

        // Suelo inicial.
        {
            id: 'starting_ground',
            type: 'platform',
            x: 100,
            y: 250,
            width: 200,
            height: 40,
            dimension: 'shared'
        },

        // Plataformas alcanzables con salto normal.
        /*{
            id: 'platform_01',
            type: 'platform',
            x: 70,
            y: 205,
            width: 48,
            height: 12,
            dimension: 'shared'
        },*/

        {
            id: 'platform_02',
            type: 'platform',
            x: 100,
            y: 165,
            width: 48,
            height: 12,
            dimension: 'shared'
        },

        {
            id: 'platform_03',
            type: 'platform',
            x: 20,
            y: 125,
            width: 48,
            height: 12,
            dimension: 'shared'
        },

        // Coleccionable de doble salto.
        {
            id: 'double_jump_pickup',
            type: 'abilityPickup',
            ability: 'doubleJump',
            x: 20,
            y: 108,
            dimension: 'shared',
            options: {
                width: 16,
                height: 20,
                color: 0xffc857
            }
        },

        // Zona de transición.
        /*{
            id: 'platform_04',
            type: 'platform',
            x: 290,
            y: 245,
            width: 48,
            height: 12,
            dimension: 'shared'
        },*/

        // Plataforma elevada: requiere doble salto.
        {
            id: 'final_platform',
            type: 'platform',
            x: 425,
            y: 95,
            width: 70,
            height: 12,
            dimension: 'shared'
        }

    ],

    goal: {

        x: 440,
        y: 70,

        options: {
            width: 12,
            height: 30,
            color: 0xffc857
        }

    },

    mechanisms: []

};
