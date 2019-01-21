export function main(pokitOS) {
    console.log('loaded')
    let e = pokitOS.ecs.makeEntity({height: 320, width: 320, depth: 10, x: 0, y: 0, z: 10})
            .addCog("audioSource", {startOnInit: true, loop:true, spatial: true, id: 'cali'})
            .addCog("img", {id: "offensive"})
            .addCog('spriteActor')
            .addUniqueCog('inc', {
                c: 0,
                update () {
                    this.c+=.01;
                    e.x = Math.sin(this.c) * 16 * 20   
                }
            })
}