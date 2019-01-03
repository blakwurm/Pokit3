export default class SpatialHash {
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
        return new Set(makeSpatialKey(this.cs, entity).map(key=>this._map.get(key)).flat())
    }
    
}
function makeSpatialKey(cs, {x,y,z,width,height,depth}){
    let hw=Math.floor((x+width)/cs)
    let hh=Math.floor((y+height)/cs)
    let hd=Math.floor((z+depth)/cs)
    let keys = []
    for (let xi=Math.floor(x/cs);xi<=hw;xi=xi+1) {
        for (let yi=Math.floor(y/cs);yi<=hh;yi=yi+1) {
            for (let zi=Math.floor(z/cs);zi<=hd;zi=zi+1) {
                keys.push(((1e5*xi+1e3*yi+zi)|0))
            }
        }
    }
    return keys
}