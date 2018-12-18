export class StartScreen {
    constructor(pokitOS, startEntity) {
        this.engine = pokitOS;
        this.startScreen = startEntity;
    }

    globalUpdate(component) {
        console.log(this.engine.input.buttons)
        if (this.engine.input.buttons.a) {
            this.engine.baublebox.destroyEntity(this.startScreen);
            this.engine.baublebox.destroySystem('startScreen');
        }
    }
}