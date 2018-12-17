//import { loadMap } from './loadMap.js';
//import './kontra.js';
//import { setupPC } from './playerControl.js';

export class GameCart {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.ecs = pokitOS.baublebox;
        this.assetPool = pokitOS.bellhop;
    }
    async preload() {
        //loadMap(this.pokitOS);
        this.pokitOS.bellhop.loadImage('startScreen', '/carts/krackedEC/rawsprites/startscreen.png');
    }
    async start() {
        let startScreen = this.ecs.makeEntity({ x: 160, y: 160, z: -1, height: 80, width: 80, scaleX: 4, scaleY: 4, },
            'jewlsTexture', {ID: 'startScreen', width: 80, height: 80, x: 0, y: 0},
            'jewlsActor', {});

        setupPC(this.pokitOS);
        let camA = makeQuadCam(-8000, -8000); //Top Left Cam
        let camB = makeQuadCam(8000, -8000);  //Top Right Cam
        let camC = makeQuadCam(-8000, 8000);  //Bottom Left Cam
        let camD = makeQuadCam(8000, 8000);   //Bottom Right Cam
        let camViewA = makeQuadCamView(0, 0, camA);
        let camViewB = makeQuadCamView(160, 0, camB);
        let camViewC = makeQuadCamView(0, 160, camC);
        let camViewD = makeQuadCamView(160, 160, camD);
    }

    makeQuadCamView(x, y, camera) {
        return this.ecs.makeEntity({ x: x, y: y, z: 0, width: 160, height: 160 },
            'jewlsCameraView', {cameraID: camera});
    }

    makeQuadCam(x, y) {
        return this.ecs.makeEntity(
            { x: x, y: y, width: 160, height: 160 },
            'camera', {});
    }

    
}