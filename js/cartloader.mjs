export function getBaseCartURL() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('cart') ? urlParams.get('cart') : new URL('/carts/democart', window.location.href).href
}
export async function parseCartManifest(baseurl) {
    baseurl = baseurl+'/'
    let url = new URL('./cart.json', baseurl)
    let manifest = await fetch(url)
    console.log(url)
    console.log(manifest.json())

}
export async function preloadCartAssets(cartinfo) {

}
export async function startCart(cartinfo, pokitOS) {

}