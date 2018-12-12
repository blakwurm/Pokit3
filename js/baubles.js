import {Bauble} from './baublebox.js';

class IMGRenderer extends Bauble {
    constructor(canvas) {
        super('imgrenderer', 1);
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }
    render(components) {
        for (let _tup of components.get('img').entries()) {
            let entityID = _tup[0];
            let img = _tup[1];
            let t = components.get('transform').get(entityID);
            this.context.save();
            this.context.translate(t.x, t.y);
            this.context.rotate(t.rotation);
            this.context.drawImage(img, -t.width/2, -t.height/2);
            this.context.restore();
        }
    }
}

function imgComponent(opts, entityID, components) {
    let transform = components.get('transform').get(entityID);
    let img = new Image(opts.width || transform.width, opts.height || transform.height)
    img.src = opts.src || '';
    return img;
}

export default function setupBaubleBox(baublebox, canvas) {
    baublebox.initializeSystem('imgrenderer', new IMGRenderer(canvas));
    baublebox.initializeComponent('img', imgComponent);
}