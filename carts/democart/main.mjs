import * as text from '../../../js/extras/text.mjs'

export async function main(pokitOS) {
    //console.log('loaded')
    text.init(pokitOS)
    let bl = await text.makeSpriteSheet('normal 39px monospace', 2, 2)
    console.log(bl)
    let bl_url = URL.createObjectURL(bl)
    let i = document.createElement("a")
    document.body.appendChild(i)
    i.href = bl_url
    i.download = "img.png"
    i.click()
    console.log(bl_url)
    pokitOS.assets.queueAsset('testText', bl_url, 'IMAGE')
    let e = pokitOS.ecs.makeEntity({height: 640, width: 640, depth: 10, x: 0, y: 0, z: 10})
            // .addCog("audioSource", {startOnInit: true, loop:true, spatial: true, id: 'cali'})
            .addCog("img", {id: "testText"})
            .addCog('spriteActor')
            // .addCog('tilemap', {id:"sampmap", alphaTile:8})
            .addUniqueCog('inc', {
                c: 0,
                update () {
                    this.c+=.01;
                    e.x = Math.sin(this.c) * 16 * 20   
                }
            })
}