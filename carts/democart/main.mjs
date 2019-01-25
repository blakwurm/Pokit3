import {TextSystem, makeSpriteSheet} from '../../../js/extras/text.mjs'

export async function main(pokitOS) {
    let text = new TextSystem();
    text.init(pokitOS);
    let bl = await makeSpriteSheet('50px monospace', 2, 2)
    let bl_url = URL.createObjectURL(bl)
    let i = document.createElement("a")
    document.body.appendChild(i)
    i.href = bl_url
    i.download = "img.png"
    i.click()
    // let e = pokitOS.ecs.makeEntity({height: 640, width: 640, depth: 10, x: 0, y: 0, z: 10})
    //         // .addCog("audioSource", {startOnInit: true, loop:true, spatial: true, id: 'cali'})
    //         // .addCog("img", {id: "santasprites"})
    //         //.addCog('spriteActor')
    //         //.addCog('tilemap', {id:"sampmap", alphaTile:8})
    //         .addCog('textRenderer', {fontSize:20})
    //         // .addUniqueCog('inc', {
    //         //     c: 0,
    //         //     update () {
    //         //         this.c+=.01;
    //         //         e.x = Math.sin(this.c) * 16 * 20   
    //         //     }
    //         // })
}