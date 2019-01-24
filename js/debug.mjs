export let pattern = /.*/;
export function Log(label, ...optionalParams){
    if(pattern.test(label)){
        console.log(label, ...optionalParams);
    }
}