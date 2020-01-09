import {Types} from './assetmanager.js';

export class Mixer {
    constructor(){
        this._racks = [];
        this._ctx = new AudioContext();
        this._started = false;

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
        
        engine.ecs.setCog('audioListener', AudioListener);
        engine.ecs.setCog('audioSource', AudioSource);

        this.createRack(false);
        let n = this.getNode(1, 0);
        n.connect(this._ctx.destination);

        engine.ecs.defaultCamera.addCog('audioListener', {});
    }

    createRack(connectToMaster=true){
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
        return this._racks[rack][index];
    }

    async makeSource(buffer, rack = 0){
        if(!this._started){
            await this._ctx.resume();
            this._started = true;
        }
        let src = this._ctx.createBufferSource();
        src.buffer = buffer;
        let vol = this._ctx.createGain();
        let pan = this._ctx.createStereoPanner();
        src.connect(vol);
        vol.connect(pan);
        pan.connect(this.getNode(0,rack))
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
        //console.log(buffer)
        //console.log(this.engine.assets)
        let src = await this.engine.mixer.makeSource(buffer, this.rack);
        //console.log(src)
        this.src = src;

        this.src.src.loop = this.loop;
        this.src.src.playbackRate.value = this.speed;

        if(this.spatial){
            //this._volume = 0;
        }

        if(this.startOnInit){
            this.play();
        }
    }
    update(entity){
        let audioListener = this.engine.mixer.audioListener;
        if(this.spatial && audioListener){
            let atten =  (entity.distance(audioListener.entity)/audioListener.maxHearingDistance);
            if(atten > 1) atten = 1;
            
            this._volume = 1- atten;
            this.pan = Math.sin(entity.deg2rad(audioListener.entity.bearing(entity)) * atten);
        }
        //console.log({pan:this.pan, volume: this._volume})
        this.src.pan.pan.value = this.pan;
        this.src.vol.gain.value = this.maxVolume * this._volume;
    }
    getSide(b){
        if(b === 0 || b === 180) return 0;
        return b < 180 ? 1 : -1;
    }
    getHorizontalBearing(reference, compare){
        let b = reference.bearing(compare);
        let s = this.getSide(b);
        switch(s){
            case 0:
                return 0;
            case 1:
                return b / 180;
            case -1:
                return -((360 - b) / 180);
        }
    }
    play() {
        this.src.src.start();
    }
    stop() {
        this.src.src.stop();
    }
}