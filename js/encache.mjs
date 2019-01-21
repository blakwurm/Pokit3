function encache() {
    let cache = {};
    function solve(obj, store) {
        let key = obj.id+'';
        if(store) {
            cache[key] = obj; 
        } 
        else { 
            return (cache[key])? cache[key] : false;
        }
    }
    solve._cache = cache;
    return solve;
}
// usage
// cache = obj_cache();
// retreive object based on it self
// cache(obj);
// store object
// cache(obj, true);
// acces cache
// cache._cache;