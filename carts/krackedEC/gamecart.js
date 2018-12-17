//import { loadMap } from './loadMap.js';
//import './kontra.js';
//import { setupPC } from './playerControl.js';

//http://localhost:8080/?cart=%2Fcarts%2FkrackedEC%2Fgamecart.js test url

export class GameCart {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.ecs = pokitOS.baublebox;
        this.assetPool = pokitOS.bellhop;
        this.input = pokitOS.inputManager;
    }
    async preload() {
        //loadMap(this.pokitOS);
        this.assetPool.loadImage('startScreen', '/carts/krackedEC/rawsprites/startscreen.png');
        this.assetPool.loadImage('mapA', '/carts/krackedEC/rawsprites/mapA.png');
        this.assetPool.loadImage('mapB', '/carts/krackedEC/rawsprites/mapB.png');
        this.assetPool.loadImage('mapC', '/carts/krackedEC/rawsprites/mapC.png');
        this.assetPool.loadImage('mapD', '/carts/krackedEC/rawsprites/mapD.png');
    }

    async start() {
        let startScreen = this.makeActor(160, 160, 'startScreen', 1, 80, 80, 4, 4);
        let mapA = this.makeActor(-8000 + 80, -8000 + 80, 'mapA');
        let mapB = this.makeActor(-8000 + 80, 8000 + 80, 'mapB');
        let mapC = this.makeActor(8000 + 80, -8000 + 80, 'mapC');
        let mapD = this.makeActor(8000 + 80, 8000 + 80, 'mapD');
        //setupPC(this.pokitOS);
        let camA = this.makeQuadCam(-8000, -8000); //Top Left Cam
        let camB = this.makeQuadCam(8000, -8000);  //Top Right Cam
        let camC = this.makeQuadCam(-8000, 8000);  //Bottom Left Cam
        let camD = this.makeQuadCam(8000, 8000);   //Bottom Right Cam
        let camViewA = this.makeQuadCamView(0, 0, camA);
        let camViewB = this.makeQuadCamView(160, 0, camB);
        let camViewC = this.makeQuadCamView(0, 160, camC);
        let camViewD = this.makeQuadCamView(160, 160, camD);
    }

    makeActor(x, y, texture, z = 0, width, height, scaleX = 1, scaleY = 1) {
        return this.ecs.makeEntity({ x: x, y: y, z: z, height: height, width: width, scaleX: scaleX, scaleY: scaleY, },
            ['jewlsTexture', { ID: texture, width: width, height: height, x: 0, y: 0 }],
            ['jewlsActor', {}]);
    }
    start(){
        // setupPC(this.pokitOS);
    }

    makeQuadCamView(x, y, camera) {
        return this.ecs.makeEntity({ x: x, y: y, z: 0, width: 160, height: 160 },
            ['jewlsCameraView', {cameraID: camera}]);
    }

    makeQuadCam(x, y) {
        return this.ecs.makeEntity(
            [{ x: x, y: y, width: 160, height: 160 }],
            ['camera', {}]);
    }

    
}