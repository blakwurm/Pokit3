export default class SpatialHash {
    constructor(cellsize) {
        this.cs = cellsize;
        this._map = new Map();
    }
    
}
let makerange = (min,max) => [...new Array(Math.abs(Math.ceil(max-min))+1).keys()].map(a=>a+Math.ceil(min))
let keypart = (x,y,z) => x*1e10 + y*1e5 + z//`${x},${y},${z}`
function makeSpatialKey(cs, {x,y,z,width,height,depth}){
    console.time('makesp')
    let [hw, hh, hd] = [width, height, depth].map(a=>Math.floor(a/2))
    let b = a=>a/cs
    let c = (a) => makerange(b(a[0]), b(a[1]))
    let keys = []
    for (let xi of c([x-hw,x+hw])) {
        for (let yi of c([y-hh,y+hh])) {
            for (let zi of c([z-hd,z+hd])) {
                keys.push(keypart(xi,yi,zi))
            }
            
        }
    }
    console.timeEnd('makesp')
    return keys
}
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))
console.log(makeSpatialKey(30, {x:8,y:8,width:16,height:16,z:10,depth:1}))