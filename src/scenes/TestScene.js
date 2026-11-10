import Phaser from 'phaser';
import Player from '../entities/Player.js';
import DimensionManager from '../dimensions/DimensionManager.js';
import LevelBuilder from '../levels/LevelBuilder.js';
import level01 from '../levels/data/level01.js';

export default class TestScene extends Phaser.Scene {

    constructor() {
        super('TestScene');
    }

    create() {
        this.physics.world.setBounds(
            0,
            0,
            480,
            270
        );

        this.dimensionManager = new DimensionManager(this);

        this.player = new Player(
            this,
            level01.playerSpawn.x,
            level01.playerSpawn.y
        );

        this.dimensionManager.setPlayer(this.player);

        this.player.abilityManager.unlock('dimensionalDash');
        this.player.abilityManager.unlock('wallJump');
        this.player.abilityManager.unlock('doubleJump');
        this.player.abilityManager.unlock('aetherGlide');
        this.player.abilityManager.unlock('dimensionalPulse');
        this.player.abilityManager.unlock('temporalEcho');

        this.levelBuilder = new LevelBuilder(
            this,
            this.player,
            this.dimensionManager
        );

        this.level = this.levelBuilder.build(level01);

        this.wall = this.level.objectsById.get('main_wall');

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

        if (this.player.temporalEcho.gameObject) {

            actors.push(
                this.player.temporalEcho.gameObject
            );
        }

        const currentDimension =
            this.dimensionManager.currentDimension;

        this.pressureSwitches?.forEach(
            pressureSwitch => {

                pressureSwitch.update(
                    actors,
                    currentDimension
                );

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