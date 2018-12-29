import pokitOS from './pokitos.js';
import PokitOS from './pokitos.js';
export function main(
    bundle
) {
    let pokitos = new PokitOS(bundle)
    pokitos.start();
}