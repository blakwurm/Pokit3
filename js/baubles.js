import {Bauble} from './baublebox.js';

class IMGRenderer extends Bauble {
    constructor(canvas) {
        super('imgrenderer', 1);
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }
    render(components) {
        this.context.clearRect(0, 0, 320, 320);
        for (let _tup of imagesSortedByZ(components)) {
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
function imagesSortedByZ(components) {
    let getT = (x) => components.get_transform(x[0]);
    function sortfn(a, b) {
        let a_t = getT(a);
        let b_t = getT(b);
        return a_t.z - b_t.z;
    }
    return [...components.get('img').entries()].sort(sortfn);
}

function imgComponent(opts, entityID, components) {
    let transform = components.get('transform').get(entityID);
    let img = new Image(opts.width || transform.width, opts.height || transform.height)
    img.src = opts.src || '';
    return img;
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
    baublebox.initializeComponent('img', imgComponent);
    if (!skipintro) {
        setupBootAnimation(baublebox, done_callback);
    } 
}