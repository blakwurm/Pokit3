export class StartScreen {
    constructor(pokitOS, startEntity) {
        this.engine = pokitOS;
        this.startScreen = startEntity;
    }

    globalUpdate(components) {
        console.log(this.startScreen);
        if (this.engine.input.buttons.a) {
            components.get('identity').get(this.startScreen).requestDelete = true;
            this.engine.baublebox.destroySystem('startScreen');
        }
    }
}