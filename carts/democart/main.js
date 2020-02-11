export function main(pokitOS) {
    // let sun = pokitOS.ecs.makeEntity({z: 10, scaleX: .2, scaleY: .2}, "angry")
    //         .addUniqueCog('rot', {
    //             update () {
    //                 sun.rotation += 1;
    //             }
    //         });
    // let planet = pokitOS.ecs.makeEntity({}, "angry", "planet")
    //         .addUniqueCog('inc', {
    //             c: 0,
    //             update () {
    //                 this.c+=.01;
    //                 planet.x = Math.sin(this.c) * 16 * 20   
    //             }
    //         });

    // //pokitOS.ecs.makeEntity({}, "stupid");

    // planet.parent = sun;

    for(let i = 0; i < 1000; i++) {
        let x = Math.random() * 2000 - 1000;
        let y = Math.random() * 2000 - 1000;
        pokitOS.ecs.makeEntity({x:x, y:y}, "stupid");
    }
}