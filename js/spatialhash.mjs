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
                keys.push(((1e5*xi+1e3*yi+zi)|1))
            }
        }
    }
    return keys
}
function moo() {
    console.time('moo.')
for (let i = 0;i < 64e3;i++) {
    makeSpatialKey(30,{x:8+i,y:0+i,width:16,height:26,z:1,depth:1})
}
    console.timeEnd('moo.')
}
console.time('baseline')
for (let i = 0; i < 64e3;i++) {

}
console.timeEnd('baseline')
moo()
moo()
moo()
moo()
moo()
moo()

//setup: let x=28,y=60,z=5,width=16,height=16,depth=1,cs=30