import {Types} from "./assetmanager.js"
import { PokitOS } from "./pokitos.js";

export interface ICartManifest {
    name: string,
    main: string,
    baseURL?: URL,
    module?: ICart,
    assetgroups: {
        [group: string]: string[]
    },
    assets: {
        [asset: string]: [string, string]
    }
}

export interface ICart {
    main: (engine: PokitOS)=>void;
}

export function getBaseCartURL(): URL {
    let urlParams = new URLSearchParams(window.location.search);
    let urlpart = urlParams.get('cart')
    let carturl = new URL(urlpart ? urlpart + '/' : '/carts/democart//', window.location.origin)
    console.log(carturl.href)
    return carturl
}
export async function parseCartManifest(baseurl: URL): Promise<ICartManifest> {
    let newurl = new URL('cart.json', baseurl.href)
    let manifest = <ICartManifest>await (await fetch(newurl.toString())).json()
    manifest.baseURL = baseurl
    console.log(newurl)
    console.log(manifest)
    return manifest
}
export async function preloadCartAssets(cartinfo: ICartManifest, pokitOS: PokitOS) {
    console.log(cartinfo)
    let promises = []
    console.log(Types)    
    for (let [k,[type, url]] of Object.entries(cartinfo.assets)) {
        console.log(type)
        let newurl = new URL(url, cartinfo.baseURL.href)
        promises.push(pokitOS.assets.queueAsset(k, newurl.toString(), Types[type]))
    }
    for (let p in promises) {
        await p
    }

}
export async function loadCartModule(cartinfo: ICartManifest, pokitOS: PokitOS) {
    let modurl = new URL(cartinfo.main, cartinfo.baseURL.href)
    console.log(modurl)
    let mod = await import(modurl.toString())
    console.log(mod)
    cartinfo.module = mod
    mod.preload ? mod.preload() : ''
    
}
export async function startCart(cartinfo: ICartManifest, pokitOS: PokitOS) {
    console.log('loading')
    cartinfo.module.main(pokitOS);
}