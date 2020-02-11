export function main(pokitOS) {
    console.log('changed');
    let sun = pokitOS.ecs.makeEntity({z: 10, scaleX: .2, scaleY: .2}, "angry")
            .addUniqueCog('rot', {
                update () {
                    sun.rotation += 1;
                }
            });
    let planet = pokitOS.ecs.makeEntity({}, "angry", "planet")
            .addUniqueCog('inc', {
                c: 0,
                update () {
                    this.c+=.01;
                    planet.x = Math.sin(this.c) * 16 * 20   
                }
            });

    planet.parent = sun;
}