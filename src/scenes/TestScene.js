import Phaser from 'phaser';

import Player from '../entities/Player.js';
import DimensionManager from '../dimensions/DimensionManager.js';

import DimensionalBarrier from '../objects/DimensionalBarrier.js';
import PulseSwitch from '../objects/PulseSwitch.js';
import PressureSwitch from '../objects/PressureSwitch.js';

export default class TestScene extends Phaser.Scene {

    constructor() {
        super('TestScene');
    }

    create() {

        // Administrador dimensional.
        this.dimensionManager = new DimensionManager(this);

        this.physics.world.setBounds(
            0,
            0,
            480,
            270
        );

        // Suelo compartido.
        const ground = this.add.rectangle(
            240,
            250,
            480,
            40,
            0x777777
        );

        this.physics.add.existing(ground, true);

        // Jugador.
        this.player = new Player(this, 80, 180);

        this.dimensionManager.setPlayer(this.player);

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

        // Plataforma exclusiva de Aether.
        this.createPlatform(
            150,
            210,
            100,
            12,
            0x38c6c8,
            'aether'
        );

        // Plataforma exclusiva de Umbra.
        this.createPlatform(
            370,
            185,
            100,
            12,
            0x9b59ff,
            'umbra'
        );

        // Barrera dimensional exclusiva de Umbra.
        this.barrier = new DimensionalBarrier(
            this,
            this.player,
            220,
            180,
            16,
            100,
            {
                dimension: 'umbra'
            }
        );

        // Pared compartida controlada por interruptores.
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

        // Interruptores de pulso.
        new PulseSwitch(this, 120, 180, 16, 16, {
            type: 'permanent',
            dimension: 'aether'
        });

        new PulseSwitch(this, 165, 180, 16, 16, {
            type: 'permanent',
            dimension: 'umbra'
        });

        new PulseSwitch(this, 80, 160, 16, 16, {
            type: 'temporary',
            duration: 3000,
            dimension: 'shared'
        });

        new PulseSwitch(this, 220, 100, 16, 16, {
            type: 'permanent',
            dimension: 'umbra'
        });

        // Interruptores de presión.
        new PressureSwitch(this, 190, 226, 24, 8, {
            dimension: 'aether'
        });

        new PressureSwitch(this, 350, 226, 24, 8, {
            dimension: 'umbra'
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

    createPlatform(x, y, width, height, color, dimension) {

        const platform = this.add.rectangle(
            x,
            y,
            width,
            height,
            color
        );

        this.physics.add.existing(platform, true);

        this.physics.add.collider(
            this.player.gameObject,
            platform
        );

        this.dimensionManager.register(
            platform,
            dimension
        );

        return platform;
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

        const currentDimension =
            this.dimensionManager.currentDimension;

        // Actualizar interruptores de presión.
        this.pressureSwitches?.forEach(
            pressureSwitch => {
                pressureSwitch.update(
                    actors,
                    currentDimension
                );
            }
        );

        // Controlar la pared compartida.
        const isAnySwitchPressed =
            this.pressureSwitches?.some(
                pressureSwitch => pressureSwitch.isPressed
            ) ?? false;

        this.wall.setVisible(!isAnySwitchPressed);

        this.wall.body.enable = !isAnySwitchPressed;
    }

}