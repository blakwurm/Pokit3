export class Firmware {
    constructor(kontra, canvas) {
        this.kontra = kontra;
        this.canvas = canvas;
        this.screen = canvas.getContext('2d');
        this.bootscreen = new Image(320, 320);
        this.bootscreen.src = "/img/bootscreen_text.svg";
        this.bootscreen_top = new Image(320, 320);
        this.bootscreen_top.src = "/img/bootscreen_top_dash.svg";
        this.bootscreen_bottom = new Image(320, 320);
        this.bootscreen_bottom.src = "/img/bootscreen_bottom_dash.svg";
        this.boot_audio = new Audio("/sound/introtune.ogg");

    }

    async init () {
        this.kontra.init(this.canvas);
        return this;
    }

    setup_boot_anim (bootsprite, bootsprite_top, bootsprite_bottom) {
        let hold = 35;
        let display_bootsprite = true;
        console.log('booting');
        function update_boot_anim() {
                let textin = false;
                let topin = false;
                let bottomin = false;
                let opacity = 100;
                if (bootsprite.y > 0) {
                    bootsprite.y -= 4;
                    console.log(bootsprite.x);
                    return;
                } 

                if (bootsprite_top.x < 0) {
                    bootsprite_top.x += 20;
                    console.log(bootsprite_top.x)
                    return;
                }

                if (bootsprite_bottom.x > 0) {
                    bootsprite_bottom.x -= 20;
                    console.log(bootsprite_bottom.x)
                    return;
                }

                if (hold > 0) {
                    console.log('hold is ' + hold);
                    hold -= 1;
                    return;
                }


                if (bootsprite.opacity > 0) {
                    [bootsprite, bootsprite_bottom, bootsprite_top].map(function (img) {
                        img.opacity -= 2;
                        console.log(img.opacity);
                    })
                }
            }
        return update_boot_anim;
    }

    async boot() {
        let bootsprite = kontra.sprite({
            x: 0, y: 320, width: 320, height: 320, opacity: 100, image: this.bootscreen
        });
        let bootsprite_top = kontra.sprite({
            x: -320, y: 0, width: 320, height: 320, opacity: 100, image: this.bootscreen_top

        });
        let bootsprite_bottom = kontra.sprite({
            x: 320, y: 0, width: 320, height: 320, opacity: 100, image: this.bootscreen_bottom
        });
        let update_anim = this.setup_boot_anim(bootsprite, bootsprite_top, bootsprite_bottom);
        this.boot_audio.play();
        this.bootloop = kontra.gameLoop({
            fps: 60,
            update:function () {
                update_anim();
            },
            render: function() {
                bootsprite.render();
                bootsprite_top.render();
                bootsprite_bottom.render();
            }
        });
        this.bootloop.start();

    }
}
