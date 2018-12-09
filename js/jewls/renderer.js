export const OPEN_GL = 1;
export const BASIC = 0;

let module = null;

export function renderSprite(sprite, position, rotation, scale, scaleType) {

}

export function clear(color) {

}

export function setRenderBackend(backend) {
    switch(backend) {
        case OPEN_GL:
            break;
        case BASIC:
            break;
    }
}