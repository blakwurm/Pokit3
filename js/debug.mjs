export class Logging{
    pattern = '.*';
    Log(label, data, ...optionalParams){
        let regex = new RegExp(this.pattern);
        if(regex.test(label)){
            console.log(data, ...optionalParams);
        }
    }
}