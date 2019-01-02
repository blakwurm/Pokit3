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
function __spat_key_asm__(stdlib, foreign, heap) {
    'use asm';
    const arr = new stdlib.Int32Array(heap);
    const fround = stdlib.Math.fround;
    const floor = stdlib.Math.floor;
    const imul = stdlib.Math.imul;
    const out = foreign.log;
    const retoffset = 10;
    function make_key(){
        var cs = 0;
        var counter = 1;
        var i = 0;
        var x = 0;
        var y = 0;
        var z = 0;
        var width = 0;
        var height = 0;
        var depth = 0;
        var xmin = 0;
        var xmax = 0;
        var ymin = 0;
        var ymax = 0;
        var zmin = 0;
        var zmax = 0;
        var xi = 0;
        var yi = 0;
        var zi = 0;
        counter = counter<<2;
        cs=arr[1]|0;
        x=~~(+(arr[2]|0)/+(cs|0))|0;
        y=~~(+(arr[3]|0)/+(cs|0))|0;
        z=~~(+(arr[4]|0)/+(cs|0))|0;
        width=~~(+(~~(+(arr[5]|0)/+(cs|0))|0)/2.0);
        height=~~(+(~~(+(arr[6]|0)/+(cs|0))|0)/2.0);
        depth=~~(+(~~(+(arr[7]|0)/+(cs|0))|0)/2.0);
        xmin=(x-width)|0
        xmax=(((x+width)|0)+1)|0
        ymin=(y-height)|0
        ymax=(((y+height)|0)+1)|0
        zmin=(z-depth)|0
        zmax=(((z+depth)|0)+1)|0
        xi = xmin|0;
        yi = ymin|0;
        zi = zmin|0;
        for (xi = (xmin|0);(xi|0)<(xmax|0);xi=~~(+(xi|0)+1.0)) {
            for (yi = (ymin|0);(yi|0)<(ymax|0);yi=~~(+(yi|0)+1.0)) {
                for (zi = (zmin|0);(zi|0)<(zmax|0);zi=~~(+(zi|0)+1.0)) {
                    arr[10] = xi
                    counter=(counter+1)|0
        }}}
    }
    function test() {
        var l = 0x00000000;
        l = arr[0]|0;
        return l|0;
    }
    return {
        make_key: make_key,
        test: test
    }
}
// let newheap = new Int32Array([1,2,3,4,5,6,7,8])
let heap = new ArrayBuffer(0x6000000);
let stdlib = {Int32Array: Int32Array, Math: Math}
let foreign = {log: console.log}
let fl = Math.floor
let hw = 0;
let hh = 0;
let hd = 0;
let keykey = ''
let memres = ''
let keys = ''
let count = 0
let xi = 0
let yi = 0
let zi = 0
function makeSpatialKey(cs, {x,y,z,width,height,depth}){
    keykey = `${cs},${x},${y},${z},${width},${height},${depth}`
    memres = keycache.get(keykey)
    if (memres) {
        return memres
    }
    hw = fl(width/2)|0
    hh = fl(height/2)|0
    hd = fl(depth/2)|0
    // let keys = new Int32Array(d(cs,x,y,z,hw,hh,hd))
    keys = []
    count = 0|0;
    for (xi of c([x-hw,x+hw], cs)) {
        for (yi of c([y-hh,y+hh], cs)) {
            for (zi of c([z-hd,z+hd], cs)) {
                // keys.push(keypart(xi,yi,zi))
                keys.push(`${fl(xi)},${fl(yi)},${fl(zi)}`)
                // keys[count] = (1e5*xi+1e3*yi+zi)
                count++
            }
        }
    }
    keycache.set(keykey,keys)
    return keys
}
let {make_key} = __spat_key_asm__(stdlib, foreign, heap)
function makeSpatialKey_prev(cs, {x,y,z,width,height,depth}){
    let v = new Int32Array(heap);
    v.set([cs,x,y,z,width,height,depth], 1)
    let offset = make_key()
    // console.log(v[10])
    // console.log(v[11])
    // console.log(new Int32Array(heap))
}
function moo() {
    console.time('moo.')
for (let i = 0;i < 200;i++) {
    makeSpatialKey(30+i,{x:8,y:8,width:16+i/2,height:16+i/2,z:1,depth:1})
}
    console.timeEnd('moo.')
}
function moo_too() {
    console.time('moo?')
for (let i = 0;i < 200;i++) {
    makeSpatialKey_prev(30+i,{x:8,y:8,width:16+i/2,height:16+i/2,z:1,depth:1})
}
    console.timeEnd('moo?')
}
moo()
moo()
moo()
moo()
moo()
moo()
moo_too()
console.log('memoooooooo')
moo()
moo_too()