import { html, render } from 'https://unpkg.com/lit-html?module'

if (screenfull.enabled) {
    document.querySelector('#metabuttons #fullscreen').addEventListener('click', () => screenfull.toggle());
}
document.addEventListener('touchstart', (ev) => console.log(ev));

function debug_fill_canvas() {
    let c = document.getElementById('gamescreen');
    let ctx = c.getContext('2d');
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, c.width, c.height);
}
debug_fill_canvas()