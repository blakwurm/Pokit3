class BasicCameraMovement {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.componentsRequired = ['camera', 'identity'];
    }

    entityUpdate([entityID, _, cam]) {
        if (this.pokitOS.input.buttons.up) {
            cam.y++;
        }
        if (this.pokitOS.input.buttons.down) {
            cam.y--;
        }
        if (this.pokitOS.input.buttons.left) {
            cam.x++;
        }
        if (this.pokitOS.input.buttons.right) {
            cam.x--;
        }
        if (this.pokitOS.input.buttons.a) {
            cam.scale+= 0.1;
        }
        if (this.pokitOS.input.buttons.b) {
            cam.scale-= 0.1;
        }
        if (this.pokitOS.input.buttons.y) {
            cam.scale = 1;
        }
        if (this.pokitOS.input.buttons.x) {
            cam.scale = 2;
        }

    }
}

export class GameCart {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.img = new Image();
    }
    async preload() {
        let parma = new URLSearchParams(window.location.search)
        this.imgsrc = parma.get('img');
        this.width = parma.get('width');
        this.height = parma.get('height');
        this.img.width = this.width;
        this.img.height = this.height;
        this.img.src = this.imgsrc;
        
        console.log(this.img);
        this.pokitOS.baublebox.initializeSystem('basiccameramove', new BasicCameraMovement(this.pokitOS));
    }
    async start() {
        this.pokitOS.baublebox.makeEntity({x: 160, y: 160, width: this.img.width, height: this.img.height})
            ('img', this.img);
    }
}