import {Bauble} from './baublebox.js';

function cameraComponent() {
    return {}
}

class CanvasClearer extends Bauble {
    constructor(canvas) {
        super('clearer', 1);
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }
    render() {
        this.context.clearRect(0, 0, 320, 320);
    }
}
class IMGRenderer extends Bauble {
    constructor(canvas) {
        super('imgrenderer', 10);
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }
    render(components) {
        for (let _tup of entitiesSortedByZ('img', components)) {
            let entityID = _tup[0];
            let img = _tup[1];
            let t = components.get_transform(entityID);
            this.context.save();
            this.context.translate(t.x, t.y);
            this.context.rotate(degreesToRadians(t.rotation));
            this.context.drawImage(img, -t.width/2, -t.height/2, t.width, t.height);
            this.context.restore();
        }
    }
}
function degreesToRadians(degrees) {
    return (degrees) * Math.PI / 180;
}

function imgComponent(opts, entityID, components) {
    let transform = components.get('transform').get(entityID);
    let img = new Image(opts.width || transform.width, opts.height || transform.height)
    img.src = opts.src || '';
    return img;
}

class Tilerenderer extends Bauble {
    constructor(canvas, img, maptilewidth, maptileheight, tilepixelwidth, tilepixelheight) {
        super('tilerenderer', 5);
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        tilepixelwidth = tilepixelwidth || 16;
        tilepixelheight = tilepixelheight || 16;
        maptilewidth = maptilewidth || img.width / tilepixelwidth;
        maptileheight = maptileheight || img.height / tilepixelheight;
        this.img = img;
        this.tilewidth = tilepixelwidth;
        this.tileheight = tilepixelheight;
        this.offsets = calcTileOffsets(maptilewidth, maptileheight, tilepixelwidth, tilepixelheight);
        console.log(this.offsets);
    }
    render(components) {
        for (let _tup of entitiesSortedByZ('tile', components)) {
            let entityID = _tup[0];
            let tile = _tup[1];
            let [ox, oy] = this.offsets[tile.index];
            let t = components.get_transform(entityID);
            this.context.save();
            this.context.translate(t.x, t.y);
            this.context.rotate(degreesToRadians(t.rotation));
            this.context.drawImage(this.img, ox, oy, this.tilewidth, this.tileheight,  -t.width/2, -t.height/2, t.width, t.height);
            this.context.restore();
        }

    }
}
class TileMapRenderer extends Tilerenderer {
    constructor(canvas, img, maptilewidth, maptileheight, tilepixelwidth, tilepixelheight) {
        super(canvas, img, maptilewidth, maptileheight, tilepixelwidth, tilepixelheight);
        this.priority = 3;
        this.name = 'tilemaprenderer';
        this.debug_next_render = true;
    }
    render(components) {
        let camera = components.get_transform([...components.get('camera').keys()][0])
        for (let _tup of entitiesSortedByZ('tilemap', components)) {
            let mapEntityID = _tup[0];
            let mapdata = _tup[1];
            let self = this;
            mapdata.mapstructure
            .forEach((layer, layer_index) =>
                layer.forEach((row, row_index) =>
                    row.forEach((cell, cell_index) => {
                            let [ox, oy] = this.offsets[cell];
                        if (cell) {
                            self.context.save();
                            self.context.translate(mapdata.tilewidth * cell_index, mapdata.tileheight * row_index);
                            self.context.drawImage(this.img, ox, oy, self.tilewidth, self.tileheight, 0 - (camera.x - 160), 0 - (camera.y - 160), self.tilewidth, self.tileheight)
                            self.context.restore();

                        }
                        if (self.debug_next_render) {
                            console.log(`${row_index}/${cell_index} [${ox},${oy}] for ${cell}`)
                        }
                    })))
                    
            this.debug_next_render = false;
        }
    }
}
function entitiesSortedByZ(componentname, components) {
    let getT = (x) => components.get_transform(x[0]);
    function sortfn(a, b) {
        let a_t = getT(a);
        let b_t = getT(b);
        return a_t.z - b_t.z;
    }
    return [...components.get(componentname).entries()].sort(sortfn);
}
function calcTileOffsets(maptilewidth, maptileheight, tilepixelwidth, tilepixelheight) {
    console.time('beginOffsets')
    let numbertiles = maptilewidth * maptileheight;
    let offsets = [[-1, -1]];
    for (let h = 0; h < maptileheight; h++) {
        for (let w = 0; w < maptilewidth; w++) {
            offsets.push([w * tilepixelwidth, h * tilepixelheight]);
        }
    } 
    console.timeEnd('beginOffsets')
    return offsets;
}

function tileComponent(opts, entityID, components) {
    return Object.assign({index: 0, tileset: ''}, opts);
}

function tilemapComponent(opts, entityID, components) {
    opts.entityID = entityID;
    return opts;
}

class BootAnimationSystem extends Bauble {
    constructor(done_callback) {
        super('bootanimation', 10);
        this.done_callback = done_callback;
        this.boot_done = false;
        this.hold = 34;
    }

    update(components) {
        let part = (partname) => components.get_transform([...components.get('bootanim' + partname).keys()][0]);
        let bootsprite = part('text');
        let bootsprite_bottom = part('bottom');
        let bootsprite_top = part('top');

        if (this.boot_done) {
            teardownBootAnimation(this.baublebox, 
                [bootsprite.entityID, bootsprite_bottom.entityID, bootsprite_top.entityID]);
            this.done_callback();
            return
        }

        if (bootsprite.y > 160) {
            bootsprite.y -= 4;
            console.log(bootsprite.x);
            return;
        } 
        
        if (bootsprite_top.x < 160) {
            bootsprite_top.x += 20;
            console.log(bootsprite_top.x)
            return;
        }
        
        if (bootsprite_bottom.x > 160) {
            bootsprite_bottom.x -= 20;
            console.log(bootsprite_bottom.x)
            return;
        }
        
        if (this.hold > 0) {
            console.log('hold is ' + this.hold);
            this.hold -= 1;
            return;
        }
        
        if (bootsprite.width < 2e5) {
            [bootsprite, bootsprite_bottom, bootsprite_top].forEach(expandoAnimationPart);
            console.log('doin')
            return
        }


        this.boot_done = true;
    }
}
function expandoAnimationPart(t) {
    t.rotation += 2;
    t.width *= 1.03;
    t.height *= 1.03;
}

function bootAnimPart (opts, entityID, components) {
        return '';
}

function setupBootAnimation(baublebox, done_callback) {
    baublebox.pokitOS.bellhop.loadSound('boot_sound', '/sound/fanfare.wav');
    baublebox.initializeSystem('bootanimation', new BootAnimationSystem(done_callback));
    baublebox.initializeComponent('bootanimtop', bootAnimPart);
    baublebox.initializeComponent('bootanimbottom', bootAnimPart);
    baublebox.initializeComponent('bootanimtext', bootAnimPart);
    let bootpart = (partname, x, y, z) => baublebox
        .makeEntity({x: x, y: y, z: z, width: 320, height: 320})
                    ('img', {src: `/img/bootscreen_${partname}.svg`})
                    (`bootanim${partname}`);
    bootpart('text', 160, 160 * 4, 1);
    bootpart('top', 160 * -2, 160, 2);
    bootpart('bottom', 160 * 3, 160, 2);
}
function teardownBootAnimation(baublebox, boot_anim_ids) {
    baublebox.destroySystem('bootanimation');
    ['top', 'bottom', 'text'].forEach(
        function (partname) {
            baublebox.destroyComponent('bootannim' + partname);
    })
    boot_anim_ids.forEach(x => baublebox.destroyEntity(x));
}

export default function setupBaubleBox(baublebox, canvas, skipintro, done_callback) {
    baublebox.initializeSystem('imgrenderer', new IMGRenderer(canvas));
    baublebox.initializeSystem('canvasclearer', new CanvasClearer(canvas));
    baublebox.initializeComponent('camera', cameraComponent);
    baublebox.makeEntity({x: 260, y: 260, width: 320, height: 320})('camera');
    baublebox.initializeComponent('img', imgComponent);
    let tileimage = new Image();
    tileimage.src = '/carts/basictiles.png';
    baublebox.Tilerenderer = Tilerenderer;
    baublebox.TileMapRenderer = TileMapRenderer;
    baublebox.initializeComponent('tile', tileComponent);
    baublebox.initializeComponent('tilemap', tilemapComponent);
    if (!skipintro) {
        setupBootAnimation(baublebox, done_callback);
    } 
}