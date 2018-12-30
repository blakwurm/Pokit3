import * as jewls from './jewls/jewlsRenderer.js';

function grabImage(imgsrc) {
    let img = new Image();
    let prom = new Promise((allgood) => {img.onload = () => allgood(img)});
    img.src = imgsrc;
    return prom;
}

async function loadBootImages() {
    for (let partname of ['bottom', 'text', 'top']) {
        console.log('thing')
        let tex = await grabImage(`/img/bootscreen_${partname}.svg`);
        console.log(tex);
        jewls.uploadTexture(`bootscreen_${partname}`, tex);
    }
}

export default async function initializeJewls(pokitOS, canvas) {
    console.log(canvas)
    pokitOS.baublebox.initializeSystem('jewlsActor', new jewls.JewlsActor(pokitOS, canvas));
    pokitOS.baublebox.initializeSystem('jewlsMainCamera', new jewls.JewlsMainCamera(pokitOS));
    pokitOS.baublebox.initializeSystem('jewlsCamera', new jewls.JewlsCamera(pokitOS));
    pokitOS.baublebox.initializeSystem('jewlsCameraView', new jewls.JewlsCameraView(pokitOS));

    pokitOS.baublebox.initializeComponent('jewlsActor', jewls.jewlsActor);
    pokitOS.baublebox.initializeComponent('jewlsTexture', jewls.jewlsTexture);
    pokitOS.baublebox.initializeComponent('jewlsMainCamera', () => { });
    pokitOS.baublebox.initializeComponent('jewlsCameraView', jewls.jewlsCameraView);
    loadBootImages();
}