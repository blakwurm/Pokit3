import {Bauble} from './baublebox.js';

class IMGRenderer extends Bauble {
    constructor() {
        super('imgrenderer', 1);
    }
    render(components) {
    }
}


export default function setupBaubleBox(baublebox) {
    baublebox.initializeSystem('imgrenderer', new IMGRenderer);
}