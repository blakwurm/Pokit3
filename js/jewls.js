import * as jewls from './jewls/jewlsRenderer.js';

function grabImage(imgsrc) {
    let img = new Image();
    return Promise(allgood => img.onload = () => allgood(img));
}

async function loadBootImages() {
    for (let partname of ['bottom', 'text', 'top']) {
        let tex = await grabImage(`/img/bootscreen_${partname}`);
        jewls.uploadTexture(`bootscreen_${partname}`);
    }
}

export default function initializeJewls(pokitOS, canvas) {
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