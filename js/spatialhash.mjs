export default class SpatialHash {
    constructor(cellsize) {
        this.cs = cellsize;
        this._map = new Map();
    }
    
}
let makerange = (min,max) => [...new Array(Math.abs(Math.ceil(max-min))+1).keys()].map(a=>a+Math.ceil(min))
function* rango(min,max,step=1) {
    for (let i=min;i<=max;i+=step) {
        yield i;
    }
}
let keycache = new Map();
let c = (a, cs) => rango(a[0]/cs, a[1]/cs)
let d = (cs,x,y,z,hw,hh,hd) => Math.ceil((((((x-hw)/cs+(x+hw)/cs))+1)*(((y-hh)/cs+(y+hh)/cs)+1)*(((z-hd)/cs+(z+hd)/cs)+1)))
// let d = (cs,x,y,z,hw,hh,hd) => (((x-hw)/cs+(x+hw)/cs)*1e5+((y-hh)/cs+(y+hh)/cs)*1e3+((z-hd)/cs+(z+hd)/cs))
// cs, x, y, z, width, height, depth
// let newheap = new Int32Array([1,2,3,4,5,6,7,8])
let fl = Math.floor
function makeSpatialKey(cs, {x,y,z,width,height,depth}){
    // keykey = `${cs},${x},${y},${z},${width},${height},${depth}`
    // memres = keycache.get(keykey)
    // if (memres) {
    //     return memres
    // }
    var count = 0;
    var xi = Math.floor(x/cs)
    var yi = Math.floor(y/cs)
    var zi = Math.floor(z/cs)
    var hw=Math.floor((x+width)/cs)
    var hh=Math.floor((y+height)/cs)
    var hd=Math.floor((z+depth)/cs)
    var keys = new Int32Array(Math.ceil(((x%cs)/cs)+(width/cs))*Math.ceil(((y%cs)/cs)+(height/cs))*Math.ceil(((z%cs)/cs)+(depth/cs)))
    console.log('' + xi + ',' + yi + ',' + zi)
    console.log('' + hw + ',' + hh + ',' + hd)
    for (xi=Math.floor(x/cs);xi<=hw;xi=xi+1) {
        for (yi=Math.floor(y/cs);yi<=hh;yi=yi+1) {
            for (zi=Math.floor(z/cs);zi<=hd;zi=zi+1) {
                // keys.push(keypart(xi,yi,zi))
                // keys.push(`${fl(xi)},${fl(yi)},${fl(zi)}`)
                keys[count] = ((1e5*xi+1e3*yi+zi)|1)
                count=count+1;
            }
        }
    }
    // keycache.set(keykey,keys)
    console.log(count)
    return keys
}
function moo() {
    console.time('moo.')
for (let i = 0;i < 60;i++) {
    console.log(makeSpatialKey(30,{x:8+i,y:0+i,width:16,height:26,z:1,depth:1}))
}
    console.timeEnd('moo.')
}
console.time('baseline')
for (let i = 0; i < 64e3;i++) {

}
console.timeEnd('baseline')
moo()

//setup: let x=28,y=60,z=5,width=16,height=16,depth=1,cs=30