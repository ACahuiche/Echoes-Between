
import Phaser from 'phaser';

import Player from '../entities/Player.js';
import DimensionManager from '../dimensions/DimensionManager.js';
import LevelBuilder from '../levels/LevelBuilder.js';
import LevelComplete from './LevelComplete.js';
import LevelFailed from './LevelFailed.js';

import wandererSprite from '../assets/sprites/wanderer.png';
import portalSprite from '../assets/sprites/portal.png';
import abilitiesSprite from '../assets/sprites/habilidades.png';

import level01 from '../levels/data/level01.js';
import level02 from '../levels/data/level02.js';
import level03 from '../levels/data/level03.js';
import level04 from '../levels/data/level04.js';
import level05 from '../levels/data/level05.js';
import level06 from '../levels/data/level06.js';
import level07 from '../levels/data/level07.js';
import level08 from '../levels/data/level08.js';

export default class TestScene extends Phaser.Scene {

    constructor() {

        super('TestScene');

    }

    preload() {

        this.load.spritesheet(
            'wanderer',
            wandererSprite,
            {
                frameWidth: 32,
                frameHeight: 32,
                spacing: 0,
                margin: 0
            }
        );

        this.load.spritesheet(
            'portal',
            portalSprite,
            {
                frameWidth: 32,
                frameHeight: 64,
                spacing: 0,
                margin: 0
            }
        );

        this.load.spritesheet(
            'abilities',
            abilitiesSprite,
            {
                frameWidth: 13,
                frameHeight: 17,
                spacing: 0,
                margin: 0
            }
        );

    }

    create(data = {}) {

        this.createAbilityAnimations();

        this.physics.world.setBounds(
            0,
            0,
            480,
            270
        );

        this.levels = [
            level01,
            level02,
            level03,
            level04,
            level05,
            level06,
            level07,
            level08
        ];

        this.currentLevelId =
            data.levelId ?? 'level01';

        const levelData = this.levels.find(
            level => level.id === this.currentLevelId
        );

        if (!levelData) {

            throw new Error(
                `Level not found: ${this.currentLevelId}`
            );

        }

        this.isLevelCompleted = false;
        this.isLevelFailed = false;
        this.pressureSwitches = [];
        this.tutorialText = null;
        this.tutorialKey = null;
        this.tutorialAbility = null;

        this.dimensionManager = new DimensionManager(this);

        this.player = new Player(
            this,
            levelData.playerSpawn.x,
            levelData.playerSpawn.y
        );

        this.dimensionManager.setPlayer(this.player);

        if (data.progress) {

            this.player.abilityManager.restoreProgress(
                data.progress
            );

        }

        this.levelStartProgress =
            this.player.abilityManager.getProgress();

        this.levelBuilder = new LevelBuilder(
            this,
            this.player,
            this.dimensionManager
        );

        this.level = this.levelBuilder.build(
            levelData,
            () => this.completeLevel()
        );

        this.levelStartTime = this.time.now;

        this.createTutorial(levelData.id);

        this.events.on(
            'ability-unlocked',
            this.showAbilityTutorial,
            this
        );

        this.events.once('shutdown', () => {

            this.events.off(
                'ability-unlocked',
                this.showAbilityTutorial,
                this
            );

        });

        console.log(
            `Current level: ${levelData.name}`
        );

        console.log(
            'Unlocked abilities:',
            this.player.abilityManager.getUnlockedAbilities()
        );

        console.log(
            'Ability progress:',
            this.player.abilityManager.getProgress()
        );

        console.log(
            'Aether Glide level:',
            this.player.abilityManager.getLevel('aetherGlide')
        );

    }

    createAbilityAnimations() {

        const animations = [
            {
                key: 'pickup-doubleJump',
                start: 0,
                end: 3
            },
            {
                key: 'pickup-wallJump',
                start: 4,
                end: 7
            },
            {
                key: 'pickup-dimensionalDash',
                start: 8,
                end: 11
            },
            {
                key: 'pickup-aetherGlide',
                start: 12,
                end: 15
            },
            {
                key: 'pickup-dimensionalPulse',
                start: 16,
                end: 19
            },
            {
                key: 'pickup-temporalEcho',
                start: 20,
                end: 23
            }
        ];

        animations.forEach(animation => {

            if (this.anims.exists(animation.key)) {
                return;
            }

            this.anims.create({
                key: animation.key,
                frames: this.anims.generateFrameNumbers(
                    'abilities',
                    {
                        start: animation.start,
                        end: animation.end
                    }
                ),
                frameRate: 6,
                repeat: -1
            });

        });

    }

    update(time, delta) {

        if (this.isLevelCompleted || this.isLevelFailed) return;

        this.player.update(delta);

        if (this.player.gameObject.body.bottom > this.scale.height + 8) {

            this.failLevel();

            return;

        }

        this.updateAbilityTutorial();

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

        this.pressureSwitches?.forEach(pressureSwitch => {

            pressureSwitch.update(
                actors,
                currentDimension
            );

        });

        this.level.mechanismManager.update();

    }

    completeLevel() {

        if (this.isLevelCompleted) return;

        this.isLevelCompleted = true;

        const elapsed = this.time.now - this.levelStartTime;

        const minutes = Math.floor(elapsed / 60000);

        const seconds = Math.floor((elapsed % 60000) / 1000);

        const centiseconds = Math.floor((elapsed % 1000) / 10);

        const formattedTime =
            `${String(minutes).padStart(2, '0')}:` +
            `${String(seconds).padStart(2, '0')}.` +
            `${String(centiseconds).padStart(2, '0')}`;

        const progress = this.player.abilityManager.getProgress();

        this.player.body.setVelocity(0, 0);
        this.player.body.setAcceleration(0, 0);
        this.player.body.enable = false;

        const currentIndex = this.levels.findIndex(
            level => level.id === this.currentLevelId
        );

        const nextLevel = this.levels[currentIndex + 1] ?? null;

        console.log('Level completed!');
        console.log(`Completion time: ${formattedTime}`);
        console.log('Saved ability progress:', progress);

        this.levelCompleteScreen = new LevelComplete(
            this,
            {
                levelName: this.level.name,
                time: formattedTime,
                nextLevelName: nextLevel?.name ?? null,
                isFinalLevel: nextLevel === null
            },
            () => {

                if (!nextLevel) {

                    this.scene.start('MainMenu');

                    return;

                }

                this.scene.restart({
                    levelId: nextLevel.id,
                    progress: progress
                });

            }
        );

    }

    failLevel() {

        if (this.isLevelCompleted || this.isLevelFailed) return;

        this.isLevelFailed = true;

        const progress = this.levelStartProgress;

        this.player.gameObject.body.enable = false;

        this.levelFailedScreen = new LevelFailed(
            this,
            () => {

                this.scene.restart({
                    levelId: this.currentLevelId,
                    progress: progress
                });

            },
            () => {

                this.scene.start('MainMenu');

            }
        );

    }

    createTutorial(levelId) {

        if (levelId === 'level01') {

            this.showInitialTutorial(
                'USA LAS FLECHAS HACIA LOS LADOS PARA MOVERTE',
                'Move'
            );

            return;

        }

        if (levelId === 'level02') {

            this.showInitialTutorial(
                'PRESIONA SHIFT PARA CAMBIAR ENTRE AETHER Y UMBRA',
                'Shift'
            );

        }

    }

    showInitialTutorial(message, expectedKey) {

        this.removeTutorial();

        this.tutorialKey = expectedKey;

        this.tutorialText = this.add.text(
            240,
            12,
            message,
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#ffffff',
                fontStyle: 'bold',
                backgroundColor: '#00000099',
                padding: {
                    x: 8,
                    y: 6
                }
            }
        );

        this.tutorialText
            .setOrigin(0.5, 0)
            .setScrollFactor(0)
            .setDepth(100);

        this.input.keyboard.on(
            'keydown',
            this.handleTutorialInput,
            this
        );

    }

    handleTutorialInput(event) {

        if (!this.tutorialText) return;

        if (this.tutorialKey === 'Move') {

            const moved =
                event.code === 'ArrowLeft' ||
                event.code === 'ArrowRight';

            if (!moved) return;

            this.showInitialTutorial(
                'PRESIONA ESPACIO PARA SALTAR',
                'Space'
            );

            return;

        }

        if (this.tutorialKey === 'Space') {

            if (event.code !== 'Space') return;

            this.removeTutorial();

            return;

        }

        if (this.tutorialKey === 'Shift') {

            if (event.key !== 'Shift') return;

            this.removeTutorial();

        }

    }

    showAbilityTutorial(abilityName) {

        const tutorials = {

            doubleJump: {
                message: 'PRESIONA ESPACIO EN EL AIRE PARA SALTAR DE NUEVO'
            },

            wallJump: {
                message: 'PUEDES AGARRARTE A LAS PAREDES Y SALTAR SOBRE ELLAS'
            },

            dimensionalDash: {
                message: 'PRESIONA CTRL PARA ATRAVESAR BARRERAS DIMENSIONALES'
            },

            aetherGlide: {
                message: 'MANTÉN PRESIONADA C PARA PLANEAR Y CONTROLAR TU CAÍDA'
            },

            dimensionalPulse: {
                message: 'PRESIONA F PARA ACTIVAR INTERRUPTORES A DISTANCIA'
            },

            temporalEcho: {
                message: 'PRESIONA Q PARA CREAR UN ECO QUE ACTIVE INTERRUPTORES'
            }

        };

        const tutorial = tutorials[abilityName];

        if (!tutorial) return;

        this.removeTutorial();

        this.tutorialAbility = abilityName;

        this.tutorialText = this.add.text(
            240,
            12,
            tutorial.message,
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#ffffff',
                fontStyle: 'bold',
                backgroundColor: '#00000099',
                padding: {
                    x: 8,
                    y: 6
                }
            }
        );

        this.tutorialText
            .setOrigin(0.5, 0)
            .setScrollFactor(0)
            .setDepth(100);

    }

    updateAbilityTutorial() {

        if (!this.tutorialAbility) return;

        const movementAbilities = this.player.movementAbilities;

        if (
            this.tutorialAbility === 'doubleJump' &&
            movementAbilities.hasPerformedDoubleJump()
        ) {

            this.removeTutorial();

            return;

        }

        if (
            this.tutorialAbility === 'wallJump' &&
            movementAbilities.hasPerformedWallJump()
        ) {

            this.removeTutorial();

        }

    }

    removeTutorial() {

        if (this.tutorialText) {

            this.tutorialText.destroy();

        }

        this.tutorialText = null;
        this.tutorialKey = null;
        this.tutorialAbility = null;

        this.input.keyboard.off(
            'keydown',
            this.handleTutorialInput,
            this
        );

    }

}
