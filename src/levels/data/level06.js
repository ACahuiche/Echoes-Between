
export default {

    id: 'level06',

    name: 'El Descenso',

    playerSpawn: {
        x: 45,
        y: 25
    },

    dimensions: {

        initial: 'aether',

        backgrounds: {
            aether: '#163b48',
            umbra: '#291638'
        }

    },

    objects: [

        // Plataforma elevada inicial.
        // El espacio con el techo es reducido para impedir saltar.
        {
            id: 'starting_platform',
            type: 'platform',
            x: 20,
            y: 45,
            width: 180,
            height: 16,
            dimension: 'shared'
        },

        // Coleccionable que desbloquea Aether Glide.
        {
            id: 'aether_glide_pickup',
            type: 'abilityPickup',
            ability: 'aetherGlide',
            x: 100,
            y: 25,
            dimension: 'shared',
            options: {
                width: 16,
                height: 20,
                color: 0xffc857
            }
        },

        // Plataforma de aterrizaje, bastante alejada.
        {
            id: 'landing_platform',
            type: 'platform',
            x: 410,
            y: 225,
            width: 90,
            height: 16,
            dimension: 'umbra'
        }

    ],

    // Goal situado sobre la plataforma inferior.
    goal: {

        x: 430,
        y: 197,

        options: {
            width: 12,
            height: 40,
            color: 0xffc857
        }

    },

    mechanisms: []

};
