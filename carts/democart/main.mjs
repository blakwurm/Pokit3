import {TextSystem, makeSpriteSheet} from '../../../js/extras/text.mjs'

export async function main(pokitOS) {
    let text = new TextSystem();
    text.init(pokitOS);
    let e = pokitOS.ecs.makeEntity({height: 640, width: 640, depth: 10, x: 0, y: 0, z: 10})
    //         // .addCog("audioSource", {startOnInit: true, loop:true, spatial: true, id: 'cali'})
            //.addCog("img", {id: "text_tile_sheet"})
    //         //.addCog('spriteActor')
            //.addCog('tilemap', {id:"text_tile_map", alphaTile:8})
            .addCog('textRenderer', {fontSize:20})
    //         // .addUniqueCog('inc', {
    //         //     c: 0,
    //         //     update () {
    //         //         this.c+=.01;
    //         //         e.x = Math.sin(this.c) * 16 * 20   
    //         //     }
    //         // })
}