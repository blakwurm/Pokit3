let rfs = (vals) => Array.prototype.sort.call(vals, (a,b)=>a.z-b.z)
export class Renderer{
    constructor(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.torender = new Map();
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
        entity.flags.add('visable')
        this.torender.set(entity.id, entity);
        this.imgdata.set(entity.id, Object.assign({imgname:'', offx:0, offy:0,offwidth:null,offheight:null} ,imgdata))
    }
    removeEntity(entity) {
        this.torender.delete(entity.id);
    }
    addCamera(entity) {
        this.cameras.set(entity.id, entity);
    }
    removeCamera(entity) {
        this.cameras.delete(entity.id);
    }
    render() {
        let r = rfs(this.torender.values());
        let c = rfs(this.cameras.values())[0]
        let con = this.context;
        for (let {id,x,y,width,height} of r) {
            let {imgname,offx,offy,offwidth,offheight} = this.imgdata.get(id);
            let i = this.pokitOS.assets.imgs.get(imgname);
            con.save();
            con.translate(x,y);
            con.drawImage(i,offx|0,offy|0,width|i.width,height|i.height,0,0,offwidth|i.width,offheight|i.height);
            // con.drawImage(i,0,0,width|i.width,height|i.height);
            con.restore();
        }
    }
}