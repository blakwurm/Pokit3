import {TrollyComponent} from './trollybelt.js'

export class IMGRenderer extends TrollyComponent {
    // Refactored from https://github.com/straker/kontra/blob/master/src/sprite.js
    constructor(canvas) {
        super('imgrenderer');
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    makebundle (ent) {
        return new Image(ent.transform.width, ent.transform.height);
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

