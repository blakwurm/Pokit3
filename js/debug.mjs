export let pattern = /.*/;
export function setPattern(pat){
    pattern = pat;
}
export function Log(label, ...optionalParams){
    if(pattern.test(label)){
        var callerLine = new Error().stack.split('\n')[2];
        console.log(callerLine, "\n", label, "\n", ...optionalParams);
    }
}

export function downloadBlob(blob) {
    //console.log('loaded')
    // text.init(pokitOS)
    // let bl = await text.makeSpriteSheet('normal 39px monospace', 2, 2)
    // console.log(bl)
    let bl_url = URL.createObjectURL(blob)
    let i = document.createElement("a")
    // document.body.appendChild(i)
    i.href = bl_url
    i.download = "img.png"
    i.click()
}
