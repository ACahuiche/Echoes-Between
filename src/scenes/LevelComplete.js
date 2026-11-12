
export default class LevelComplete {

    constructor(scene, data, onContinue) {

        this.scene = scene;
        this.onContinue = onContinue;
        this.active = true;

        const depth = 1000;

        this.overlay = scene.add.rectangle(
            240, 135, 480, 270, 0x080d18, 0.92
        );

        this.overlay
            .setScrollFactor(0)
            .setDepth(depth);

        this.title = scene.add.text(
            240, 55,
            'NIVEL COMPLETADO',
            {
                fontFamily: 'Arial',
                fontSize: '25px',
                color: '#f5c96b',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        this.levelName = scene.add.text(
            240, 100,
            data.levelName,
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        this.timeText = scene.add.text(
            240, 145,
            `TIEMPO: ${data.time}`,
            {
                fontFamily: 'Arial',
                fontSize: '22px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        this.nextLevelText = scene.add.text(
            240, 185,
            data.isFinalLevel
                ? '¡HAS COMPLETADO EL TUTORIAL BETA!'
                : `SIGUIENTE NIVEL: ${data.nextLevelName}`,
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#b7c5d5'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        this.continueText = scene.add.text(
            240, 230,
            data.isFinalLevel
                ? 'PRESIONA ENTER PARA REGRESAR AL MENU'
                : 'PRESIONA ENTER PARA CONTINUAR',
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#f5c96b',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);

        scene.input.keyboard.once(
            'keydown-ENTER',
            this.handleContinue,
            this
        );

    }

    handleContinue() {

        if (!this.active) return;

        this.active = false;

        this.onContinue();

    }

}
