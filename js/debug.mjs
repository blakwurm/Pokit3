export class Logging{
    pattern = /.*/;
    Log(label, data, ...optionalParams){
        if(pattern.test(label)){
            console.log(label + ': ' + data, ...optionalParams);
        }
    }
}