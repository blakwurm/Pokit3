export interface ISpatialEntity{
    x: number, y: number, z: number,
    height: number, width: number, depth: number,
    scaleX?: number, scaleY?: number, scaleZ?: number
}

export class SpatialHash {
    private _map: Map<number, ISpatialEntity[]>;
    cs: number;
    constructor(cellsize) {
        this.cs = cellsize;
        this._map = new Map();
    }
    add(entity: ISpatialEntity): SpatialHash {
        let spatialKeys = makeSpatialKey(this.cs, entity);
        for (let key of spatialKeys) {
            let bucket = this._map.get(key)
            bucket ? bucket.push(entity) : this._map.set(key, [entity])
        }
        return this;
    }
    addMany(entities: ISpatialEntity[]): SpatialHash {
        entities.forEach(e=>this.add(e))
        return this;
    }
    findNearby(entity: ISpatialEntity): Set<ISpatialEntity> {
        return new Set(makeSpatialKey(this.cs, entity).map(key=>this._map.get(key)).flat().filter(x=>x))
    }
    findColliding(entity: ISpatialEntity): ISpatialEntity[] {
        return Array.prototype.filter(e=>
            entity.x < e.x + e.width &&
            entity.x + entity.width > e.x &&
            entity.z < e.z + e.depth &&
            entity.z + entity.depth > e.z &&
            entity.y < e.y + e.height &&
            entity.y + entity.height > e.y,
            this.findNearby(entity))
    }
    clear(): SpatialHash {this._map.clear();return this}
    
}
function makeSpatialKey(cs: number, e: ISpatialEntity): number[]{
    let {x,y,z,width,height,depth,scaleX,scaleY,scaleZ} = e
    depth = depth || 1;
    // width *= scaleX || 1;
    // height *= scaleY || 1;
    // depth *= scaleZ || 1;
    let hw=Math.floor((x+(width/2))/cs)
    let hh=Math.floor((y+(height/2))/cs)
    let hd=Math.floor((z+(depth/2))/cs)
    // x = x-(width/2)
    // y = y-(height/2)
    // z = z-(depth/2)
    let keys = []
    for (let xi=Math.floor(((x||1)-(width/2))/cs);xi<=hw;xi=xi+1) {
        for (let yi=Math.floor((((y||1))-(height/2))/cs);yi<=hh;yi=yi+1) {
            for (let zi=Math.floor((z-(depth/2))/cs);zi<=hd;zi=zi+1) {
                // keys.push(((1e5*xi+1e3*yi+zi)||0))
                keys.push(xi + "," + yi + "," + zi);
            }
        }
    }
    //console.log(keys);
    return keys
}

let ent1 = {width: 320, height: 320, depth: 1, x: 160, y: 160, z: 1}
let ent2 = {width: 320, height: 320, depth: 1, x: -160, y: 160, z: 1}
let ent3 = {width: 320, height: 320, depth: 1, x: -1, y: 160, z: 1}

let keys1 = makeSpatialKey(1120, ent1)
let keys2 = makeSpatialKey(1120, ent2)
let keys3 = makeSpatialKey(1120, ent3)
let keyscheck = new Set([...keys1, ...keys3])

console.log(keys1)
console.log(keys2)
console.log(keys3)
console.log(keyscheck)
