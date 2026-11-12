
export default {

    id: 'level04',

    name: 'El Escalador',

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
            id: 'starting_ground',
            type: 'platform',
            x: 200,
            y: 250,
            width: 400,
            height: 40,
            dimension: 'shared'
        },

        // Coleccionable que desbloquea Wall Jump.
        {
            id: 'wall_jump_pickup',
            type: 'abilityPickup',
            ability: 'wallJump',
            x: 200,
            y: 220,
            dimension: 'shared',
            options: {
                width: 16,
                height: 20,
                color: 0xffc857
            }
        },

        // Pared vertical del extremo derecho.
        {
            id: 'climbing_wall',
            type: 'wall',
            x: 464,
            y: 135,
            width: 32,
            height: 230,
            dimension: 'shared'
        }

    ],

    // Goal suspendido del techo, pegado a la pared.
    goal: {

        x: 440,
        y: 20,

        options: {
            width: 12,
            height: 30,
            color: 0xffc857
        }

    },

    mechanisms: []

};
