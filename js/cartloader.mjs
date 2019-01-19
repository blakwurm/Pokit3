export function getBaseCartURL() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('cart') ? urlParams.get('cart') : '/carts/democart'
}
export async function parseCartManifest(baseurl) {
    let manifest = await fetch(baseurl + '/cart.json')
    console.log(manifest.json())

}
export async function preloadCartAssets(cartinfo) {

}
export async function startCart(cartinfo, pokitOS) {

}