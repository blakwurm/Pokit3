import loadMap from '../krackedEC/loadMap.js';
import * as systems from './systems.js'
import setupBaubleBox from '../../js/baubles.js';
//import './kontra.js';
//import { setupPC } from './playerControl.js';

//localhost:8080/?cart=%2Fcarts%2FkrackedEC%2Fgamecart.js test url

export class GameCart {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.ecs = pokitOS.baublebox;
        this.assetPool = pokitOS.bellhop;
        this.input = pokitOS.inputManager;
    }
    async preload() {
        console.log('preload happened');
        loadMap(this.pokitOS);
        await this.assetPool.loadImage('startScreen', '/carts/krackedEC/rawsprites/startscreen.png');
        this.assetPool.loadImage('world', '/carts/krackedEC/world.png');
        this.assetPool.loadImage('spritesheet', '/carts/krackedEC/santasprites.png');
    }

    async start() {

        let audio = new Audio('/carts/krackedEC/LastChristmas.mp3');
        audio.play();

        systems.setupPlayerControl(this.pokitOS);
        console.log(Object.assign({
            entityID: 'arb',
            x: 0, y: 0, z: 0,
            scale: 1, scaleX: 1, scaleY: 1,
            rotation: 0,
            width: 0, height: 0,
            velocityX: 0, velocityY: 0,
            requestDelete: false, willDelete: false
        }, { x: 0, y: 0, z: 0, width: 160, height: 160 }));

        console.log('start happened');
        let startScreen = this.makeActor(160, 160, 'startScreen', -1, 80, 80, 4, 4);
        let mapA = this.makeActor(-8000, -8000, 'world');
        let santa1 = this.makeSanta(-8000, -8000, 'spritesheet', 0, 16, 16, .25, .25, 0, 0, 'santa');
        let santa2 = this.makeSanta(-8000, -8000, 'spritesheet', 0, 16, 16, .25, .25, 1, 0, 'stNick');
        let santa3 = this.makeSanta(-8000, -8000, 'spritesheet', 0, 16, 16, .25, .25, 2, 0, 'fatherChristmas');
        let santa4 = this.makeSanta(-8000, -8000, 'spritesheet', 0, 16, 16, .25, .25, 3, 0, 'dedMoroz');
        let camA = this.makeQuadCam(-80, -80, santa1); //Top Left Cam
        let camB = this.makeQuadCam(-80, -80, santa2);  //Top Right Cam
        let camC = this.makeQuadCam(-80, -80, santa3);  //Bottom Left Cam
        let camD = this.makeQuadCam(-80, -80, santa4);   //Bottom Right Cam

        let camViewA = this.makeQuadCamView(79, 79, camA);
        let camViewB = this.makeQuadCamView(241, 79, camB);
        let camViewC = this.makeQuadCamView(79, 241, camC);
        let camViewD = this.makeQuadCamView(241, 241, camD);




        this.ecs.initializeSystem('startScreen', new systems.StartScreen(this.pokitOS, startScreen));
    }

    makeActor(x, y, texture, z = 0, width, height, scaleX = 1, scaleY = 1, spriteX = 0, spriteY = 0) {
        return this.ecs.makeEntity({ x: x, y: y, z: z, height: height, width: width, scaleX: scaleX, scaleY: scaleY, },
            ['jewlsTexture', { ID: texture, width: width, height: height, x: spriteX, y: spriteY }],
            ['jewlsActor', {}]);
    }

    makeSanta(x, y, texture, z = 0, width, height, scaleX = 1, scaleY = 1, spriteX = 0, spriteY = 0, santaname) {
        return this.ecs.makeEntity({ x: x, y: y, z: z, height: height, width: width, scaleX: scaleX, scaleY: scaleY, },
            ['jewlsTexture', { ID: texture, width: width, height: height, x: spriteX, y: spriteY }],
            ['jewlsActor', {}],
            ['playersprite', santaname],
            ['moves']);
    }

    makeQuadCamView(x, y, camera) {
        return this.ecs.makeEntity({ x: x, y: y, z: 0, width: 160, height: 160 },
            ['jewlsCameraView', {cameraID: camera}]);
    }

    makeQuadCam(x, y, santa) {
        return this.ecs.makeEntity(
            { x: x, y: y, width: 160, height: 160, parent: this.ecs.__components.get('identity').get(santa) },
            ['camera', {}]);
    }
}