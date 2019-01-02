export default class SpatialHash {
    constructor(cellsize) {
        this.cs = cellsize;
        this._map = new Map();
    }
    
}
function makeSpatialKey(cs, {x,y,z,width,height,depth}){
    var hw=Math.floor((x+width)/cs)
    var hh=Math.floor((y+height)/cs)
    var hd=Math.floor((z+depth)/cs)
    var keys = []
    for (var xi=Math.floor(x/cs);xi<=hw;xi=xi+1) {
        for (var yi=Math.floor(y/cs);yi<=hh;yi=yi+1) {
            for (var zi=Math.floor(z/cs);zi<=hd;zi=zi+1) {
                keys.push(((1e5*xi+1e3*yi+zi)|0))
            }
        }
    }
}