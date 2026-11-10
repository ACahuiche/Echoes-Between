import Phaser from 'phaser';
import TestScene from '../scenes/TestScene.js';

const gameConfig = {
    type: Phaser.AUTO,

    width: 480,
    height: 270,

    parent: 'game',

    backgroundColor: '#151525',

    pixelArt: true,
    antialias: false,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 900
            },
            debug: false
        }
    },

    scene: [TestScene],

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

export default gameConfig;