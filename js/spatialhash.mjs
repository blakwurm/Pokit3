export class SpatialHash {
    constructor(cellsize) {
        this.cs = cellsize;
        this._map = new Map();
    }
    add(entity) {
        let spatialKeys = makeSpatialKey(this.cs, entity);
        for (let key of spatialKeys) {
            let bucket = this._map.get(key)
            bucket ? bucket.push(entity) : this._map.set(key, [entity])
        }
        return this;
    }
    addMany(entities) {
        entities.forEach(e=>this.add(e))
        return this;
    }
    findNearby(entity) {
        return new Set(makeSpatialKey(this.cs, entity).map(key=>this._map.get(key)).flat().filter(x=>x))
    }
    findColliding(entity) {
        return Array.prototype.filter(e=>
            entity.x < e.x + e.width &&
            entity.x + entity.width > e.x &&
            entity.z < e.z + e.depth &&
            entity.z + entity.depth > e.z &&
            entity.y < e.y + e.height &&
            entity.y + entity.height > e.y,
            this.findNearby(entity))
        }
    clear() {this._map.clear();return this}
    
}
function makeSpatialKey(cs, e){
    let {x,y,z,width,height,depth,scaleX,scaleY,scaleZ} = e
    depth = depth || 1;
    width *= scaleX || 1;
    height *= scaleY || 1;
    depth *= scaleZ || 1;
    let hw=Math.floor((x+width)/cs)
    let hh=Math.floor((y+height)/cs)
    let hd=Math.floor((z+depth)/cs)
    let keys = []
    for (let xi=Math.floor((x||1)/cs);xi<=hw;xi=xi+1) {
        for (let yi=Math.floor((y||1)/cs);yi<=hh;yi=yi+1) {
            for (let zi=Math.floor(z/cs);zi<=hd;zi=zi+1) {
                keys.push(((1e5*xi+1e3*yi+zi)||0))
                //keys.push(xi + "," + yi + "," + zi);
            }
        }
    }
    //console.log(keys);
    return keys
}