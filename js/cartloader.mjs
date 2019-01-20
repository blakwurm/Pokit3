import {Types} from "./assetmanager.mjs"
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
    manifest.baseURL = baseurl
    console.log(newurl)
    console.log(manifest)
    return manifest
}
export async function preloadCartAssets(cartinfo, pokitOS) {
    console.log(cartinfo)
    let promises = []
    console.log(Types)    
    for (let [k,[type, url]] of Object.entries(cartinfo.assets)) {
        console.log(type)
        let newurl = new URL(url, cartinfo.baseURL.href)
        promises.push(pokitOS.assets.queueAsset(k, newurl, type))
    }
    for (let p in promises) {
        await p
    }

}
export async function startCart(cartinfo, pokitOS) {

}