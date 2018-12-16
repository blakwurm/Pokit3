import * as jewls from './jewls/jewlsRenderer.js';

export default function initializeJewls(pokitOS, canvas) {
    pokitOS.baublebox.initializeSystem('jewlsActor', new jewls.JewlsActor(pokitOS, canvas));
    pokitOS.baublebox.initializeSystem('jewlsMainCamera', new jewls.JewlsMainCamera(pokitOS));
    pokitOS.baublebox.initializeSystem('jewlsCamera', new jewls.JewlsCamera(pokitOS));
    pokitOS.baublebox.initializeSystem('jewlsCameraView', new jewls.JewlsCameraView(pokitOS));

    pokitOS.baublebox.initializeComponent('jewlsActor', jewls.jewlsActor);
    pokitOS.baublebox.initializeComponent('jewlsTexture', jewls.jewlsTexture);
    pokitOS.baublebox.initializeComponent('jewlsMainCamera', () => { });
    pokitOS.baublebox.initializeComponent('jewlsCameraView', jewls.jewlsCameraView);
}