export function getBaseCartURL() {
    let urlParams = new URLSearchParams(window.location.search);
    let urlpart = urlParams.get('cart')
    let carturl = new URL(urlpart ? urlpart + '/' : '/carts/democart//', window.location.origin)
    console.log(carturl.href)
    return carturl
}
export async function parseCartManifest(baseurl) {
    let newurl = new URL('cart.json', baseurl.href)
    let manifest = await (await fetch(newurl)).json()
    console.log(newurl)
    console.log(manifest)

}
export async function preloadCartAssets(cartinfo) {

}
export async function startCart(cartinfo, pokitOS) {

}