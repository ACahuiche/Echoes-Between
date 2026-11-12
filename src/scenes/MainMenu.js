
import Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {

    constructor() {
        super('MainMenu');
    }

    create() {

        this.selectedOption = 0;
        this.showingMessage = false;

        // Fondo.
        this.add.rectangle(
            240, 135, 480, 270, 0x101522
        );

        // Decoración dimensional.
        this.add.rectangle(
            115, 135, 2, 180, 0x38c6c8, 0.35
        );

        this.add.rectangle(
            365, 135, 2, 180, 0x9b59ff, 0.35
        );

        // Título.
        this.add.text(
            240, 65,
            'ECHOES',
            {
                fontFamily: 'Arial',
                fontSize: '38px',
                fontStyle: 'bold',
                color: '#e8e6ff'
            }
        ).setOrigin(0.5);

        this.add.text(
            240, 105,
            'BETWEEN',
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                fontStyle: 'bold',
                color: '#bd8cff'
            }
        ).setOrigin(0.5);

        this.add.text(
            240, 135,
            'Two worlds. One journey. A thousand possibilities.',
            {
                fontFamily: 'Arial',
                fontSize: '8px',
                color: '#aab6c8'
            }
        ).setOrigin(0.5);

        // Opciones.
        this.playText = this.add.text(
            240, 180,
            'JUGAR',
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                fontStyle: 'bold',
                color: '#f5c96b'
            }
        ).setOrigin(0.5);

        this.tutorialText = this.add.text(
            240, 210,
            'TUTORIAL BETA',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        this.updateSelection();

        // Instrucciones.
        this.add.text(
            240, 250,
            '↑ ↓ SELECCIONAR     ENTER CONFIRMAR',
            {
                fontFamily: 'Arial',
                fontSize: '9px',
                color: '#72e5e8'
            }
        ).setOrigin(0.5);

        // Controles.
        this.input.keyboard.on(
            'keydown-UP',
            this.previousOption,
            this
        );

        this.input.keyboard.on(
            'keydown-DOWN',
            this.nextOption,
            this
        );

        this.input.keyboard.on(
            'keydown-ENTER',
            this.confirmSelection,
            this
        );

    }

    previousOption() {

        if (this.showingMessage) return;

        this.selectedOption = 0;

        this.updateSelection();

    }

    nextOption() {

        if (this.showingMessage) return;

        this.selectedOption = 1;

        this.updateSelection();

    }

    updateSelection() {

        this.playText.setStyle({
            color: this.selectedOption === 0
                ? '#f5c96b'
                : '#ffffff',

            fontStyle: this.selectedOption === 0
                ? 'bold'
                : 'normal'
        });

        this.tutorialText.setStyle({
            color: this.selectedOption === 1
                ? '#f5c96b'
                : '#ffffff',

            fontStyle: this.selectedOption === 1
                ? 'bold'
                : 'normal'
        });

        this.playText.setText(
            this.selectedOption === 0
                ? '▶ JUGAR'
                : 'JUGAR'
        );

        this.tutorialText.setText(
            this.selectedOption === 1
                ? '▶ TUTORIAL BETA'
                : 'TUTORIAL BETA'
        );

    }

    confirmSelection() {

        if (this.showingMessage) {

            this.scene.restart();

            return;

        }

        // Jugar.
        if (this.selectedOption === 0) {

            this.showConstructionMessage();

            return;

        }

        // Tutorial Beta.
        if (this.selectedOption === 1) {

            this.scene.start('TestScene', {
                levelId: 'level01'
            });

        }

    }

    showConstructionMessage() {

        this.showingMessage = true;

        this.messageOverlay = this.add.rectangle(
            240, 135, 480, 270, 0x080d18, 0.95
        ).setDepth(10);

        this.messageTitle = this.add.text(
            240, 105,
            'EN CONSTRUCCIÓN',
            {
                fontFamily: 'Arial',
                fontSize: '23px',
                fontStyle: 'bold',
                color: '#f5c96b'
            }
        ).setOrigin(0.5).setDepth(11);

        this.messageText = this.add.text(
            240, 145,
            'EL JUEGO AÚN ESTÁ EN DESARROLLO',
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setDepth(11);

        this.messageInstruction = this.add.text(
            240, 205,
            'PRESIONA ENTER PARA REGRESAR',
            {
                fontFamily: 'Arial',
                fontSize: '11px',
                color: '#72e5e8'
            }
        ).setOrigin(0.5).setDepth(11);

    }

}
