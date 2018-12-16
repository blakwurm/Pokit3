import { Bauble } from './baublebox.js';

export default class JewlSystem extends Bauble{
    constructor(pokitOS, canvas) {
        super('jewls', Infinity);
        this.canvas = canvas;
        this.pokitOS = pokitOS;
        /** Put your other init stuff here */
    }
    globalUpdate(components) {

    }

}