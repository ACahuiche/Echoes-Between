import Phaser from 'phaser';

import Player from '../entities/Player.js';
import DimensionalBarrier from '../objects/DimensionalBarrier.js';

export default class TestScene extends Phaser.Scene {

    constructor() {

        super('TestScene');

    }

    create() {

        this.cameras.main.setBackgroundColor('#151525');

        this.physics.world.setBounds(
            0,
            0,
            480,
            270
        );

        const ground = this.add.rectangle(
            240,
            250,
            480,
            40,
            0x777777
        );

        this.physics.add.existing(ground, true);

        this.player = new Player(this, 80, 180);

        this.player.abilityManager.unlock('dimensionalDash');
        this.player.abilityManager.unlock('wallJump');
        this.player.abilityManager.unlock('doubleJump');


        this.physics.add.collider(
            this.player.gameObject,
            ground
        );

        this.barrier = new DimensionalBarrier(
            this,
            this.player,
            220,
            180,
            16,
            100
        );

        const wall = this.add.rectangle(
            320,
            180,
            16,
            100,
            0x777777
        );

        this.physics.add.existing(wall, true);

        this.physics.add.collider(
            this.player.gameObject,
            wall
        );

        console.log(
            'Unlocked abilities:',
            this.player.abilityManager.getUnlockedAbilities()
        );

    }

    update() {

        this.player.update();

    }

}