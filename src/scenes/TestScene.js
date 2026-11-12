
import Phaser from 'phaser';

import Player from '../entities/Player.js';
import DimensionManager from '../dimensions/DimensionManager.js';
import LevelBuilder from '../levels/LevelBuilder.js';
import LevelComplete from './LevelComplete.js';

import level01 from '../levels/data/level01.js';
import level02 from '../levels/data/level02.js';
import level03 from '../levels/data/level03.js';
import level04 from '../levels/data/level04.js';

export default class TestScene extends Phaser.Scene {

    constructor() {

        super('TestScene');

    }

    create(data = {}) {

        this.physics.world.setBounds(
            0,
            0,
            480,
            270
        );

        // Niveles disponibles.
        this.levels = [
            level01,
            level02,
            level03,
            level04
        ];

        // Determinar qué nivel cargar.
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

        // Limpiar referencias de interruptores anteriores.
        this.pressureSwitches = [];

        // Limpiar referencias de tutoriales.
        this.tutorialText = null;
        this.tutorialKey = null;
        this.tutorialAbility = null;

        // Crear administrador dimensional.
        this.dimensionManager = new DimensionManager(this);

        // Crear jugador.
        this.player = new Player(
            this,
            levelData.playerSpawn.x,
            levelData.playerSpawn.y
        );

        this.dimensionManager.setPlayer(this.player);

        // Restaurar progreso de habilidades.
        if (data.progress) {

            this.player.abilityManager.restoreProgress(
                data.progress
            );

        }

        // Construir nivel.
        this.levelBuilder = new LevelBuilder(
            this,
            this.player,
            this.dimensionManager
        );

        this.level = this.levelBuilder.build(
            levelData,
            () => this.completeLevel()
        );

        // Iniciar cronómetro.
        this.levelStartTime = this.time.now;

        // Tutorial inicial.
        this.createTutorial(levelData.id);

        // Escuchar desbloqueos de habilidades.
        this.events.on(
            'ability-unlocked',
            this.showAbilityTutorial,
            this
        );

        // Limpiar listeners al cerrar la escena.
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

    update(time, delta) {

        if (this.isLevelCompleted) return;

        this.player.update(delta);

        // Comprobar si el jugador completó el tutorial
        // de la habilidad recién desbloqueada.
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

        // Calcular tiempo transcurrido.
        const elapsed =
            this.time.now - this.levelStartTime;

        const minutes = Math.floor(elapsed / 60000);

        const seconds = Math.floor(
            (elapsed % 60000) / 1000
        );

        const centiseconds = Math.floor(
            (elapsed % 1000) / 10
        );

        const formattedTime =
            `${String(minutes).padStart(2, '0')}:` +
            `${String(seconds).padStart(2, '0')}.` +
            `${String(centiseconds).padStart(2, '0')}`;

        // Guardar progreso actual.
        const progress =
            this.player.abilityManager.getProgress();

        // Detener movimiento y desactivar al jugador.
        this.player.body.setVelocity(0, 0);
        this.player.body.setAcceleration(0, 0);
        this.player.body.enable = false;

        // Buscar siguiente nivel.
        const currentIndex = this.levels.findIndex(
            level => level.id === this.currentLevelId
        );

        const nextLevel =
            this.levels[currentIndex + 1] ?? null;

        console.log('Level completed!');
        console.log(`Completion time: ${formattedTime}`);
        console.log('Saved ability progress:', progress);

        // Mostrar pantalla de victoria.
        this.levelCompleteScreen = new LevelComplete(
            this,
            {
                levelName: this.level.name,
                time: formattedTime,
                nextLevelName: nextLevel?.name ?? null
            },
            () => {

                const destinationId =
                    nextLevel?.id ?? this.currentLevelId;

                this.scene.restart({
                    levelId: destinationId,
                    progress: progress
                });

            }
        );

    }

    // --------------------------------------------------
    // TUTORIALES INICIALES
    // --------------------------------------------------

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

        // Primera instrucción del nivel 01.
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

        // Tutorial de salto.
        if (this.tutorialKey === 'Space') {

            if (event.code !== 'Space') return;

            this.removeTutorial();

            return;

        }

        // Tutorial dimensional.
        if (this.tutorialKey === 'Shift') {

            if (event.key !== 'Shift') return;

            this.removeTutorial();

        }

    }

    // --------------------------------------------------
    // TUTORIALES DE HABILIDADES
    // --------------------------------------------------

    showAbilityTutorial(abilityName) {

        const tutorials = {

            doubleJump: {
                message: 'PRESIONA ESPACIO EN EL AIRE PARA SALTAR DE NUEVO'
            },

            wallJump: {
                message: 'PUEDES AGARRARTE A LAS PAREDES Y SALTAR SOBRE ELLAS'
            }

        };

        const tutorial = tutorials[abilityName];

        if (!tutorial) return;

        // Eliminar cualquier tutorial anterior.
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

        const movementAbilities =
            this.player.movementAbilities;

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
