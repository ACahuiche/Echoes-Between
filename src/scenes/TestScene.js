import Phaser from 'phaser';

import Player from '../entities/Player.js';
import DimensionalBarrier from '../objects/DimensionalBarrier.js';
import PulseSwitch from '../objects/PulseSwitch.js';

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
        this.player.abilityManager.unlock('aetherGlide');
        this.player.abilityManager.unlock('dimensionalPulse');

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
            140,
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

        new PulseSwitch(this, 120, 180, 16, 16, {
            type: 'permanent'
        });

        new PulseSwitch(this, 165, 180, 16, 16, {
            type: 'permanent'
        });

        new PulseSwitch(this, 80, 160, 16, 16, {
            type: 'temporary',
            duration: 3000
        });

        new PulseSwitch(this, 220, 100, 16, 16, {
            type: 'permanent'
        });

        console.log(
            'Unlocked abilities:',
            this.player.abilityManager.getUnlockedAbilities()
        );

        console.log(
            'Aether Glide level:',
            this.player.abilityManager.getLevel('aetherGlide')
        );

    }

    update(time, delta) {

        this.player.update(delta);

    }

}