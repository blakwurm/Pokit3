export class TrollyWheel {
    constructor(name){
        this.name = name;
        this.trollybelt = undefined;
    }
    init(ent){}
    preupdate(){}
    update(ent){}
    destroy(ent){}
    makebundle(ent){return new Map();}
}

export class IMGRenderer extends TrollyWheel {
    // Refactored from https://github.com/straker/kontra/blob/master/src/sprite.js
    constructor(canvas) {
        super('imgrenderer');
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    makebundle (ent, opt) {
        let img = new Image(ent.transform.width, ent.transform.height);
        if (opt) {
            img.src = opt;
        }
        return img;
    }
    prerender () {
        this.context.clearRect(0, 0, 320, 320);
    }
    render(ent) {
        let img = ent.getComponent('imgrenderer');        
        let t = ent.transform;
        this.context.save();
        this.context.translate(t.x, t.y);
        this.context.rotate(t.rotation);
        this.context.drawImage(img, -t.width/2, -t.height/2);
        this.context.restore();
    }
}

class BootAnimText extends TrollyWheel {
    constructor(){super('bootanimtext');}
    update(ent){
        let part = ent.getComponent('bootanimpart');
        if (ent.transform.y > 160) {
            ent.transform.y -= 4;
        } else {
            part.textin = true;
        }
    }
    makebundle(ent) {return {};}
}
class BootAnimTop extends TrollyWheel {
    constructor(){super('bootanimtop');}
    update(ent) {
        let part = ent.getComponent('bootanimpart');
        if (part.textin) {
            if (ent.transform.x < 160) {
                ent.transform.x += 20;
            } else {
                part.topin = true;
            }
        }
    }
}
class BootAnimBottom extends TrollyWheel {
    constructor(){super('bootanimbottom');}
    update(ent) {
        let part = ent.getComponent('bootanimpart');
        if (part.topin) {
            if (ent.transform.x > 160) {
                ent.transform.x -= 20;
            } else {
                part.bottomin = true;
            }
        }
    }
}
class BootAnimPart extends TrollyWheel {
    constructor(donefn) {
        super('bootanimpart');
        this.donefn = donefn;
        this.animstate = {
            textin: false,
            topin: false,
            bottomin: false,
            holdtimeremaining: 35,
            global_y: 160,
            animdone: false
        }
    }
    preupdate() {
        let a = this.animstate;
        if (a.textin && a.topin && a.bottomin) {
            if (a.holdtimeremaining > 0) {
                a.holdtimeremaining -= 1;
            } else {
                a.global_y -= 4;
            }
        }
        console.log(a.global_y);
        if (a.global_y < -320) {
            a.animdone = true;
            this.donefn();
        }
    }
    update(ent) {
        let a = this.animstate;
        if (a.holdtimeremaining == 0) {
            ent.transform.y = a.global_y;
        }
    }
    makebundle(ent) {return this.animstate;}
}
export function makeBootAnim(trollybelt, donefn) {
    let text, top, bottom;
    let cleanup = () => {
        trollybelt.removeScript('bootanimpart');
        trollybelt.removeScript('bootanimtop');
        trollybelt.removeScript('bootanimtext');
        trollybelt.removeScript('bootanimbottom');
        text.destroy();
        top.destroy();
        bottom.destroy();
        console.log(donefn);
        donefn();
    }
    trollybelt.registerScript(new BootAnimPart(cleanup));
    trollybelt.registerScript(new BootAnimText());
    trollybelt.registerScript(new BootAnimTop());
    trollybelt.registerScript(new BootAnimBottom());
    let makeanimpart = (startx, starty, z, src, bitname) => trollybelt.makeEntity(
        {width: 320, height: 320, x: startx, y: starty, z: z}
    ).enableComponent('imgrenderer', src)
     .enableComponent('bootanimpart')
     .enableComponent('bootanim' + bitname)
    text = makeanimpart(160, 160 * 4, 1, '/img/bootscreen_text.svg', 'text');
    top = makeanimpart(160 * -2, 160, 2, '/img/bootscreen_top.svg', 'top');
    bottom = makeanimpart(160 * 3, 160, 2, '/img/bootscreen_bottom.svg', 'bottom');
}