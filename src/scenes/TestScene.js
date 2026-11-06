import Phaser from 'phaser';

import Player from '../entities/Player.js';
import DimensionalBarrier from '../objects/DimensionalBarrier.js';
import PulseSwitch from '../objects/PulseSwitch.js';
import PressureSwitch from '../objects/PressureSwitch.js';

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
        this.player.abilityManager.unlock('temporalEcho');

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

        this.wall = this.add.rectangle(
            320,
            120,
            16,
            220,
            0x777777
        );

        this.physics.add.existing(this.wall, true);

        this.physics.add.collider(
            this.player.gameObject,
            this.wall
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

        new PressureSwitch(this, 190, 226);

        new PressureSwitch(this, 350, 226);

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

        const actors = [
            this.player.gameObject
        ];

        // Agregar el Echo si existe.
        if (this.player.temporalEcho.gameObject) {

            actors.push(
                this.player.temporalEcho.gameObject
            );
        }

        // Actualizar todos los Pressure Switches.
        this.pressureSwitches?.forEach(
            pressureSwitch => {
                pressureSwitch.update(actors);
            }
        );

        const isAnySwitchPressed =
            this.pressureSwitches?.some(
                pressureSwitch => pressureSwitch.isPressed
            ) ?? false;

        this.wall.setVisible(!isAnySwitchPressed);

        this.wall.body.enable = !isAnySwitchPressed;

    }

}