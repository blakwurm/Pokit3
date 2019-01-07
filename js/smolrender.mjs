import { SpatialHash } from './spatialhash.mjs';

let rfs = (vals) => [...Array.prototype.sort.call(vals, (a,b)=>a.z-b.z)]
let id_fn = a => a
export class Renderer{
    constructor(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.torender = new Map();
        this._sorted_torender = []
        this._sorted_cameras = []
        this._dirtyEntityFlag = false;
        this._dirtyCameraFlag = false;
        this.imgdata = new Map();
        this.cameras = new Map();
        this.pokitOS = null;
    }
    init(pokitOS) {
        this.pokitOS = pokitOS
        let s = this;
        pokitOS.ecs.setSystem('img', 
        {init: (entity, imgdata) => {
            console.log(entity)
            s.addEntity(entity, imgdata);
            entity.flags.add('visible')
        },
        delete: (entity) => {
            this.torender.delete(entity.id)
        }})
        pokitOS.ecs.setSystem('camera',
        {init: (entity) => {
            s.addCamera(entity)
            entity.flags.add('camera')
        }})
        pokitOS.ecs.makeEntity({width:320,height:320,x:160,y:160}).addSystem('camera')
        console.log(this.cameras)
    }
    addEntity(entity, imgdata) {
        entity.flags.add('visible')
        this.torender.set(entity.id, entity);
        this.imgdata.set(entity.id, Object.assign({imgname:'', offx:0, offy:0,offwidth:null,offheight:null} ,imgdata))
        this._dirtyEntityFlag = true;
    }
    removeEntity(entity) {
        this.torender.delete(entity.id);
    }
    addCamera(entity) {
        this.cameras.set(entity.id, entity);
        this._dirtyCameraFlag = true;
    }
    removeCamera(entity) {
        this.cameras.delete(entity.id);
    }
    render() {
        if (this._dirtyEntityFlag) {
            this._sorted_torender = rfs(this.torender.values())
            this._dirtyEntityFlag = false;
        }
        if (this._dirtyCameraFlag) {
            this._sorted_cameras = rfs(this.cameras.values())
            this._dirtyCameraFlag = false;
        }
        let con = this.context;
        let spatial_hash = new SpatialHash(160)
        spatial_hash.addMany(this._sorted_torender)
        for (let cam of this._sorted_cameras) {
            for (let {id,x,y,width,height} of spatial_hash.findNearby(cam)) {
                let {imgname,offx,offy,offwidth,offheight} = this.imgdata.get(id);
                let i = this.pokitOS.assets.imgs.get(imgname);
                con.save();
                // (t.x - (camera.x - 160), t.y - (camera.y - 160))
                con.translate(x-(cam.x-160),y-(cam.y-160));
                // con.drawImage(i,offx|0,offy|0,width|i.width,height|i.height,x-cam.x-160,y-cam.y-160,offwidth|i.width,offheight|i.height);
                con.drawImage(i,offx||0,offy||0,offwidth||i.width,offheight||i.height,-width/2,-height/2,width||i.width,height||i.height);
                con.restore();
            }

        }
    }
}