import {Bauble} from './baublebox.mjs';

function cameraComponent(ops) {
    let o = Object.assign({}, ops);
    o.clear = o.clear || {};
    o.clear.R = o.clear.R || 0;
    o.clear.G = o.clear.G || 0;
    o.clear.B = o.clear.B || 0;
    o.clear.A = o.clear.A || 0;
    o.initialized = false;
    return o;
}

class ThingMover extends Bauble {
    constructor() {
        super('thingmover', 100);
        this.componentsRequired = ['moves', 'identity'];
    }
    entityUpdate([entityID, moves, identity]) {
        if (!moves.paused) {
            identity.x += identity.velocityX;
            identity.y += identity.velocityY;
        }
    }
}

function movesComponent() {
    return {paused: false};
}

function degreesToRadians(degrees) {
    return (degrees) * Math.PI / 180;
}

function imgComponent(opts, entityID, components) {
    let identity = components.get('identity').get(entityID);
    let img = new Image(opts.width || identity.width, opts.height || identity.height)
    img.src = opts.src || '';
    return img;
}

function entitiesSortedByZ(componentname, components) {
    let getT = (x) => components.get_identity(x[0]);
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

    globalUpdate(components) {
        let part = (partname) => components.get_identity([...components.get('bootanim' + partname).keys()][0]);
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
            //console.log(bootsprite.x);
            return;
        } 
        if (bootsprite_top.x < 160) {
            bootsprite_top.x += 20;
            //console.log(bootsprite_top.x)
            return;
        }
        if (bootsprite_bottom.x > 160) {
            bootsprite_bottom.x -= 20;
            //console.log(bootsprite_bottom.x)
            return;
        }
        if (this.hold > 0) {
            //console.log('hold is ' + this.hold);
            this.hold -= 1;
            return;
        } 
        
        if (bootsprite.scaleX < 38) {
            [bootsprite, bootsprite_bottom, bootsprite_top].forEach(expandoAnimationPart);
            //console.log('doin')
            return
        }

        //console.log('boot animation completed');

        bootsprite.requestDelete = true;
        bootsprite_bottom.requestDelete = true;
        bootsprite_top.requestDelete = true;


        this.boot_done = true;
    }
}
function expandoAnimationPart(t) {
    t.rotation += 2.3;
    t.scaleX += .5;
    t.scaleY += .5;
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
        .makeEntity({x: x, y: y, z: z, width: 320, height: 320},
                    ['jewlsActor'],
                    ['jewlsTexture', {
                        ID: `bootscreen_${partname}`,
                        width: 320,
                        height: 320,
                        x: 0,
                        y: 0
                    }],
                    [`bootanim${partname}`]);
    let t = bootpart('text', 160, 160 * 4, 10);
    bootpart('top', 160 * -2, 160, 5);
    bootpart('bottom', 160 * 3, 160, 5);
    /*baublebox.makeEntity({width: 320, height: 320, x: 160, y: 160},
                                 ['jewlsMainCamera']);*/
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
    // baublebox.initializeSystem('imgrenderer', new IMGRenderer(canvas));
    // baublebox.initializeSystem('canvasclearer', new CanvasClearer(canvas));
    baublebox.initializeSystem('thingmover', new ThingMover())
    baublebox.initializeComponent('camera', cameraComponent);
    baublebox.initializeComponent('moves', movesComponent);
    baublebox.initializeComponent('img', imgComponent);
    let tileimage = new Image();
    tileimage.src = '/carts/basictiles.png';
    baublebox.initializeComponent('tile', tileComponent);
    baublebox.initializeComponent('tilemap', tilemapComponent);
        setupBootAnimation(baublebox, done_callback);
    if (!skipintro) {
    } 
}