import {Types, Decoder} from './assetmanager.js';
import { PokitOS } from './pokitos.js';
import { PokitEntity, ICog } from './ecs.js';

interface IMixerAudioSource {
    src: AudioBufferSourceNode,
    pan: StereoPannerNode,
    vol: GainNode
}

export class Mixer {
    private _racks: AudioNode[][];
    private _ctx: AudioContext;
    private _started: boolean;
    private _engine: PokitOS;
    audioListener: AudioListener;

    constructor(){
        this._racks = [];
        this._ctx = new AudioContext();
        this._started = false;

        this.audioListener = null;
    }

    async audioDecoder (_, response: Response){
        let buffer = await response.arrayBuffer();
        console.log(buffer)
        let ctx = this._ctx;
        return await ctx.decodeAudioData(buffer);
    }

    init(engine: PokitOS){
        this._engine = engine;

        engine.assets.registerType('SOUND');
        engine.assets.registerDecoder(Types.SOUND, (_, response) => this.audioDecoder(_, response));
        
        engine.ecs.setCog('audioListener', AudioListener);
        engine.ecs.setCog('audioSource', AudioSource);

        this.createRack(false);
        let n = this.getNode(1, 0);
        n.connect(this._ctx.destination);

        engine.ecs.defaultCamera.addCog('audioListener', {});
    }

    createRack(connectToMaster: boolean =true){
        let entryNode = new AnalyserNode(this._ctx);
        let exitNode = new AnalyserNode(this._ctx);
        entryNode.connect(exitNode);
        if(connectToMaster){
            exitNode.connect(this._racks[0][0]);
        }
        this._racks.push([entryNode,exitNode]);
        return this._racks.length -1;
    }

    addToRack(node: AudioNode, dest: number = 0, rack: number = 0){
        let lowerNode = this.getNode(dest, rack);
        let upperNode = this.getNode(dest-1, rack);
        upperNode.disconnect(lowerNode);
        upperNode.connect(node);
        node.connect(lowerNode);
        this._racks[rack].splice(dest, 0, node);
    }

    removeFromRack(index: number, rack: number =0){
        let lowerNode = this.getNode(index + 1, rack);
        let node = this.getNode(index, rack);
        let upperNode = this.getNode(index-1, rack);
        upperNode.disconnect(node);
        upperNode.connect(lowerNode);
        node.disconnect(lowerNode);
        this._racks[rack].splice(index, 1);
    }

    getNode(index: number, rack: number=0): AudioNode {
        return this._racks[rack][index];
    }

    async makeSource(buffer: AudioBuffer, rack: number = 0): Promise<IMixerAudioSource>{
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

interface IAudioListener extends ICog {
    entity?: PokitEntity,
    maxHearingDistance?: number
}

class AudioListener implements IAudioListener {
    entity: PokitEntity;
    maxHearingDistance: number;

    constructor(engine: PokitOS) {
        engine.mixer.audioListener = this;
    }
    init(entity: PokitEntity,initParams: IAudioListener){
        Object.assign(this, {maxHearingDistance:13*20}, initParams);
        this.entity = entity;
    }
}

interface IAudioSource extends ICog {
    startOnInit?: boolean,
    loop?: boolean,
    pan?: number,
    spatial?: boolean,
    id?: string,
    rack?: number,
    speed?: number,
    maxVolume?: number
}

class AudioSource implements IAudioSource{
    private _engine: PokitOS;
    private _volume: number;
    private _src: IMixerAudioSource;
    startOnInit: boolean;
    loop: boolean;
    pan: number;
    spatial: boolean;
    id: string;
    rack: number;
    speed: number;
    maxVolume: number
    constructor(engine: PokitOS){
        this._engine=engine
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
    async init(_, audioData: IAudioSource) {
        Object.assign(this, audioData)
        let buffer = await this._engine.assets.getAsset(this.id).data;
        this._engine.assets.getAsset(this.id).data = buffer;
        //console.log(buffer)
        //console.log(this.engine.assets)
        let src = await this._engine.mixer.makeSource(buffer, this.rack);
        //console.log(src)
        this._src = src;

        this._src.src.loop = this.loop;
        this._src.src.playbackRate.value = this.speed;

        if(this.spatial){
            //this._volume = 0;
        }

        if(this.startOnInit){
            this.play();
        }
    }
    update(entity: PokitEntity){
        let audioListener = this._engine.mixer.audioListener;
        if(this.spatial && audioListener){
            let atten =  (entity.distance(audioListener.entity)/audioListener.maxHearingDistance);
            if(atten > 1) atten = 1;
            
            this._volume = 1- atten;
            this.pan = Math.sin(entity.deg2rad(audioListener.entity.bearing(entity)) * atten);
        }
        //console.log({pan:this.pan, volume: this._volume})
        this._src.pan.pan.value = this.pan;
        this._src.vol.gain.value = this.maxVolume * this._volume;
    }
    getSide(b: number): number{
        if(b === 0 || b === 180) return 0;
        return b < 180 ? 1 : -1;
    }
    getHorizontalBearing(reference: PokitEntity, compare: PokitEntity){
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
        this._src.src.start();
    }
    stop() {
        this._src.src.stop();
    }
}