export let pattern = /.*/;
export function Log(label, ...optionalParams){
    if(pattern.test(label)){
        var callerLine = new Error().stack.split('\n')[2];
        console.log(callerLine, "\n", label, "\n", ...optionalParams);
    }
}