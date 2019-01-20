export function main(pokitOS) {
    console.log('loaded')
    let e = pokitOS.ecs.makeEntity({height: 320, width: 320, depth: 10, x: 0, y: 0, z: 10})
            .addSystem("audioListener", {playOnInit: true, spatial: true, id: 'cali'})
            .addSystem("img", {id: "offensive"})
            .addSystem('spriteActor')
            .addUniqueSystem('inc', {
                c: 0,
                update () {
                    this.c++;
                    e.x = Math.sin(this.c) * 16 * 20   
                }
            })
}