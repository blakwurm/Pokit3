export default async function loadMap(pokitOS) {
    let mapdata = await (await fetch('/carts/krackedEC/world.json')).json();
    let {tilewidth, tileheight, width, height, layers} = mapdata;
    let layerdata = new Map();
    for (let {name, data} of mapdata.layers) {
        layerdata.set(name, data);
    }
    let playerstarts = [];
    let presents = [];
    let chims = [];
    let floortiles = [];
    let walls = [];
    let startpoints = [];
    console.time('loadtiles');
    let makeTile = (posind, tilemapind, z) => {
        let [tilex, tiley] = getPosFromOffset(tilemapind, width, height);
        let [posx, posy] = getPosFromOffset(posind, width, height, tilewidth, tileheight);
        return {
            tile: { height: tileheight, width: tilewidth, x: tilex, y: tiley + 1 },
            transform: { height: tileheight, width: tilewidth, x: posx, y: posy, z: z }
        };
    };
    for (let n = 0; n < mapdata.width*mapdata.height; n++) {
        let vals = mapInd(n, layerdata);
        let [tileposx, tileposy] = getPosFromOffset(n, width, height);
        let foo = [
            ['background', floortiles, Infinity],
            ['walls', walls, 100],
            ['chimney', chims, 90],
            ['present', presents, 60],
            ['startpoint', startpoints, 30]
        ];
        for (let [mapname, collection, z] of foo) {
            let thing = vals.get(mapname);
            if (thing) {
                collection.push(makeTile(n, thing, z));
            }
        }

    }
    console.timeEnd('loadtiles');
    console.log(floortiles);
    console.log(walls);
    console.log(chims);
    console.log(presents);
    console.log(startpoints);
    
    return mapdata;
}

function makeJewlsTileMap(layermap) {
    return {width: 256, height: 256, spritewidth: 16, spriteheight: 16, data: [
        layermap.get('background'), layermap.get('walls'), layermap.get('chimney')
    ]}
}


function mapInd(index, map) {
    let newmap = new Map();
    for (let [key, valvec] of map) {
        newmap.set(key, valvec[index]);
    }
    return newmap;
}

function getPosFromOffset(index, width, height, multiplierwidth, multiplierheight) {
    multiplierheight = multiplierheight || 1;
    multiplierwidth = multiplierwidth || 1;
    return [Math.floor(index % width) * multiplierwidth, Math.floor(index/height) * multiplierheight]
}

function getOffsetFromPos([x, y], width, height) {
    return x + (y * height);
}