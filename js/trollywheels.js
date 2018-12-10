

export class IMGRenderer {
    // Refactored from https://github.com/straker/kontra/blob/master/src/sprite.js
    constructor(canvas) {
        this.name = 'imgrenderer';
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    makebundle (ent) {
        return Image(ent.transform.width, ent.transform.height);
    }
    init(ent) {}
    update(ent) {}
    destroy(ent) {}
    render(ent) {
        let img = ent.getComponent('imgrenderer');        
        let t = ent.transform;
        this.context.save();
        this.context.translate(t.x, t.y);
        this.context.rotate(t.rotation);
        this.context.drawImage(img, -t.width - t.x, -t.height - t.y);
        this.context.restore();
    }
}

