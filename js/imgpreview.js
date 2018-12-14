import { html, render } from 'https://unpkg.com/lit-html?module'

let mount_point = document.querySelector('#ui_mount');

function paint_ui (appstate) {
    return html`
    <canvas id="gamescreen"></canvas>
    <div>Hello</div>
    `
}

function main() {
    let state = {width: 320, height: 320, img: new Image()}
    render(paint_ui(state), mount_point);
}
main();