
export default {

    id: 'level04',

    name: 'El Escalador',

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
            id: 'starting_ground',
            type: 'platform',
            x: 200,
            y: 250,
            width: 400,
            height: 40,
            dimension: 'shared'
        },
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
    goal: {

        x: 385,
        y: 20,

        options: {
            width: 110,
            height: 60,
            scale: 2,
            rotation: 270
        }

    },

    mechanisms: []
};
