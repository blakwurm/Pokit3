import {Types} from './assetmanager.mjs';

export class Mixer {
    constructor(){
        this._racks = [];
        this._ctx = new AudioContext();

        this.audioListener = null;
    }

    async audioDecoder(_, response){
        let buffer = await response.arrayBuffer();
        console.log(buffer)
        let ctx = this._ctx;
        return await ctx.decodeAudioData(buffer);
    }

    init(engine){
        this.pokitOS = engine;

        engine.assets.registerType('SOUND');
        engine.assets.registerDecoder(Types.SOUND, (_, response) => this.audioDecoder(_, response));
        
        engine.ecs.setSystem('audioListener', AudioListener);
        engine.ecs.setSystem('audioSource', AudioSource);

        this.createRack();
        let n = this._racks[0][1];
        console.log(n)
        n.connect(this._ctx.destination);

        engine.ecs.defaultCamera.addSystem('audioListener', {});
    }

    createRack(connectToMaster){
        let entryNode = new AnalyserNode(this._ctx);
        let exitNode = new AnalyserNode(this._ctx);
        entryNode.connect(exitNode);
        if(connectToMaster){
            exitNode.connect(this._racks[0][0]);
        }
        this._racks.push([entryNode,exitNode]);
        return this._racks.length -1;
    }

    addToRack(node, dest = 0, rack = 0){
        let lowerNode = this.getNode(dest, rack);
        let upperNode = this.getNode(dest-1, rack);
        upperNode.disconnect(lowerNode);
        upperNode.connect(node);
        node.connect(lowerNode);
        this._racks[rack].splice(dest, 0, node);
    }

    removeFromRack(index, rack =0){
        let lowerNode = this.getNode(dest + 1, rack);
        let node = this.getNode(dest, rack);
        let upperNode = this.getNode(dest-1, rack);
        upperNode.disconnect(node);
        upperNode.connect(lowerNode);
        node.disconnect(lowerNode);
        this._racks[rack].splice(index, 1);
    }

    getNode(index, rack=0) {
        this._racks[rack][index];
    }

    makeSource(buffer, rack = 0){
        console.log('making audio source')
        let src = this._ctx.createBufferSource();
        console.log('created src')
        src.buffer = buffer;
        console.log('added buffer to src')
        let vol = this._ctx.createGain();
        console.log('created vol')
        let pan = this._ctx.createStereoPanner();
        console.log('created pan')
        src.connect(vol, rack);
        vol.connect(pan, rack);
        vol.connect(this.getNode(0,rack), rack)
        console.log('connected things')
        console.log(src)
        console.log(pan)
        console.log(vol)
        return {src: src, pan:pan, vol:vol};
    }
}

let AudioListener = class {
    constructor(engine) {
        engine.mixer.audioListener = this;
    }
    init(entity,initParams){
        Object.assign(this, {maxHearingDistance:13*20}, initParams);
        this.entity = entity;
    }
}

let AudioSource = class {
    constructor(engine){
        this.engine=engine
        this.startOnInit = false;
        this.loop = false;
        this.pan = 0;
        this.spatial = false;
        this.id = null;
        this.rack = 0;
        this.speed = 1;
        this.maxVolume = 1;

        this._volume = 1;
    };
    async init(entity, audioData) {
        Object.assign(this, audioData)
        let buffer = await this.engine.assets.getAsset(this.id).data;
        this.engine.assets.getAsset(this.id).data = buffer;
        console.log(buffer)
        console.log(this.engine.assets)
        let src = this.engine.mixer.makeSource(buffer, this.rack);
        console.log(src)
        this.src = src;

        this.src.src.loop = this.loop;
        this.src.src.playbackRate = this.speed;

        if(this.spatial){
            this._volume = 0;
        }

        if(this.startOnInit){
            this.play();
        }
    }
    update(entity){
        let audioListener = this.engine.mixer.audioSource;
        if(this.spatial && audioListener){
            this._volume = 1- (entity.distance(audioListener.entity)/audioListener.maxHearingDistance);
            if(this._volume < 0) this._volume = 0;
            
            this.pan = Math.sin(entity.deg2rad(audioListener.bearing(entity)));
        }
        this.src.pan.value = this.pan;
        this.src.vol.gain.value = this.maxVolume * this._volume;
    }
    play() {
        this.src.src.start();
    }
    stop() {
        this.src.src.stop();
    }
}