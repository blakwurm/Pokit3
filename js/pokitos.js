export default class PokitOS {
    constructor({inputmanager, renderer, ecs}) {
        this.input = inputmanager;
        this.renderer = renderer;
        this.ecs = ecs;
    }

    preload() {
        this.renderer.init();
    }

    tick() {


    }

    render() {
        this.renderer.render(this);
    }

}