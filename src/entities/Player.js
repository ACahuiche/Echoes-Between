import Phaser from 'phaser';

import AbilityManager from '../abilities/AbilityManager.js';
import MovementAbilities from '../abilities/MovementAbilities.js';
import DimensionalAbilities from '../abilities/DimensionalAbilities.js';

export default class Player {

    constructor(scene, x, y) {

        this.scene = scene;

        this.speed = 180;
        this.jumpForce = -400;

        this.gameObject = scene.add.rectangle(
            x,
            y,
            24,
            32,
            0x00aaff
        );

        scene.physics.add.existing(this.gameObject);

        this.body = this.gameObject.body;

        this.body.setCollideWorldBounds(true);

        this.abilityManager = new AbilityManager();

        this.movementAbilities = new MovementAbilities(
            this,
            this.abilityManager
        );

        this.dimensionalAbilities = new DimensionalAbilities(
            this,
            this.abilityManager
        );

        this.cursors = scene.input.keyboard.createCursorKeys();

        this.keys = scene.input.keyboard.addKeys({
            a: 'A',
            d: 'D',
            dash: 'CTRL',
            glide: 'C',
            pulse: 'F',
            echo: 'Q'
        });
    }

    update() {

        const body = this.body;

        body.setVelocityX(0);

        if (this.cursors.left.isDown || this.keys.a.isDown) {

            body.setVelocityX(-this.speed);
        }

        if (this.cursors.right.isDown || this.keys.d.isDown) {

            body.setVelocityX(this.speed);
        }

        this.movementAbilities.handleJump(this.cursors.space);

    }

}