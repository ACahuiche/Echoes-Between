
export default class LevelFailed {

    constructor(scene, onRetry, onMenu) {

        this.scene = scene;
        this.onRetry = onRetry;
        this.onMenu = onMenu;

        this.active = true;
        this.selectedOption = 0;

        const depth = 1000;

        this.overlay = scene.add.rectangle(
            240, 135, 480, 270, 0x080d18, 0.94
        ).setScrollFactor(0).setDepth(depth);

        this.title = scene.add.text(
            240, 65, '¡HAS CAÍDO!',
            {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: '#f5c96b',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        this.message = scene.add.text(
            240, 105, 'NO TODOS LOS CAMINOS LLEVAN A LA SALIDA...',
            {
                fontFamily: 'Arial',
                fontSize: '11px',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        this.retryText = scene.add.text(
            240, 165, 'REINTENTAR NIVEL',
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#f5c96b',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        this.menuText = scene.add.text(
            240, 200, 'VOLVER AL MENU PRINCIPAL',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#b7c5d5'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        this.instructions = scene.add.text(
            240, 245, '↑ ↓ SELECCIONAR  |  ENTER CONFIRMAR',
            {
                fontFamily: 'Arial',
                fontSize: '10px',
                color: '#687386'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        this.keyboard = scene.input.keyboard;

        this.handleUp = () => this.previousOption();
        this.handleDown = () => this.nextOption();
        this.handleEnter = () => this.confirmSelection();

        this.keyboard.on('keydown-UP', this.handleUp);
        this.keyboard.on('keydown-DOWN', this.handleDown);
        this.keyboard.on('keydown-ENTER', this.handleEnter);

        scene.events.once('shutdown', this.destroy, this);

        this.updateSelection();
    }

    previousOption() {

        if (!this.active) return;

        this.selectedOption = 0;
        this.updateSelection();
    }

    nextOption() {

        if (!this.active) return;

        this.selectedOption = 1;
        this.updateSelection();
    }

    updateSelection() {

        this.retryText.setText(
            this.selectedOption === 0
                ? '▶ REINTENTAR NIVEL'
                : 'REINTENTAR NIVEL'
        );

        this.menuText.setText(
            this.selectedOption === 1
                ? '▶ VOLVER AL MENU PRINCIPAL'
                : 'VOLVER AL MENU PRINCIPAL'
        );

        this.retryText.setColor(
            this.selectedOption === 0 ? '#f5c96b' : '#b7c5d5'
        );

        this.menuText.setColor(
            this.selectedOption === 1 ? '#f5c96b' : '#b7c5d5'
        );
    }

    confirmSelection() {

        if (!this.active) return;

        this.active = false;

        this.destroy();

        if (this.selectedOption === 0) {
            this.onRetry();
        } else {
            this.onMenu();
        }
    }

    destroy() {

        if (this.keyboard) {
            this.keyboard.off('keydown-UP', this.handleUp);
            this.keyboard.off('keydown-DOWN', this.handleDown);
            this.keyboard.off('keydown-ENTER', this.handleEnter);
        }
    }
}
