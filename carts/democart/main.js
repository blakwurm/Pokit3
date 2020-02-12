export async function main(pokitOS) {
    let main = pokitOS.stageManager.getStage("main");
    await main.load;
    let sun = main.entities.get('sun')
            .addUniqueCog('rot', {
                update () {
                    sun.rotation += 1;
                }
            });
    let planet = main.entities.get('planet')
            .addUniqueCog('inc', {
                c: 0,
                update () {
                    this.c+=.01;
                    planet.x = Math.sin(this.c) * 16 * 20;
                }
            });

    planet.parent = sun;
    //console.log(main.entities);
    main.activate();
    //console.log(main.entities);

    let stupid = pokitOS.ecs.makeShadow({}, "stupid");
    planet.addUniqueCog('stup', {
        c:0,
        update() {
            this.c ++;
            if(this.c == 100)stupid.activate();
        }
    })


    // for(let i = 0; i < 1000; i++) {
    //     let x = Math.random() * 2000 - 1000;
    //     let y = Math.random() * 2000 - 1000;
    //     pokitOS.ecs.makeEntity({x:x, y:y}, "stupid");
    // }
}