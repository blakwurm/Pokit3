export function main(pokitOS) {
    console.log('changed');
    let sun = pokitOS.ecs.makeEntity({height: 320, width: 320, depth: 10, x: 0, y: 0, z: 10, scaleX: .2, scaleY: .2})
            .addCog("img", {id: "offensive"})
            .addCog('spriteActor')
            .addUniqueCog('rot', {
                update () {
                    sun.rotation += 1;
                }
            });
    let planet = pokitOS.ecs.makeEntity({height: 320, width: 320, depth: 10, x: 0, y: 0, z: 0})
            .addCog("audioSource", {startOnInit: true, loop:true, spatial: true, id: 'cali'})
            .addCog("img", {id: "offensive"})
            .addCog('spriteActor')
            .addUniqueCog('inc', {
                c: 0,
                update () {
                    this.c+=.01;
                    planet.x = Math.sin(this.c) * 16 * 20   
                }
            });

    planet.parent = sun;
}