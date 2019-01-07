export function doIntroAnim(pokitOS) {
    let animrate = 3;
    let mag = 1;
    pokitOS.assets.getImage('load_text', '/img/bootscreen_text.svg');
    pokitOS.assets.getImage('load_top', '/img/bootscreen_top.svg');
    pokitOS.assets.getImage('load_bottom', '/img/bootscreen_bottom.svg');
    let text = pokitOS.ecs.makeEntity({x:160,y:160*3,height:320,width:320,z:10})
               .addSystem('img', {imgname:'load_text'})
    let topbar = pokitOS.ecs.makeEntity({x:160*-3,y:160,width:320,height:320})
               .addSystem('img', {imgname:'load_top'})
    let bottombar = pokitOS.ecs.makeEntity({x:160*3,y:160,width:320,height:320})
               .addSystem('img', {imgname:'load_bottom'})
    let text_done = false;
    let top_done = false;
    let bottom_done = false;
    text.addSystem('doanim', {update: () => {
        if (text.y > 160) {text.y -= animrate}
        else if (topbar.x < 159) {topbar.x += animrate*3}
        else if (bottombar.x > 159) {bottombar.x -= animrate*3}
        else if (text.width < 320*32) { [text, topbar, bottombar].forEach(x=>{
            x.width+=10*mag
            x.height+=10*mag
            mag+=0.1
        }) } else {
            text.destroy()
            topbar.destroy()
            bottombar.destroy()
            pokitOS.ecs.removeSystem('doanim')
            console.log(pokitOS)
        }

    }})
}