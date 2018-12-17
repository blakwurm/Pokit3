class SpacialHash {
    constructor(cell_size) {
        this.cell_size = cell_size;
        this.grid = new Map();
    }
    _key(vec) {
        return Math.floor(vec.x/this.cellsize) * this.cellsize + ' ' +
               Math.floor(vec.y/this.cellsize) * this.cellsize;
    }
    insert(identity) {
        let idkey = this._key(identity);
    }

}
var HashMap = function(cell_size) {
    this.cell_size = cell_size;
    this.grid = [];
   }
   
   HashMap.prototype._key = function(vec) {
     var cellsize = this.cell_size;
     return Math.floor(vec.x/cellsize) * cellsize + ' ' +
            Math.floor(vec.y/cellsize) * cellsize;
   }
   
   HashMap.prototype.insert = function(ob) {
     var obkey = this._key(ob.position);
     var grid = this.grid;
   
     if (!grid[obkey]) {
       grid[obkey] = [];
     }  
   
     grid[obkey].push(ob);
   }
   
   HashMap.prototype.getClosest = function(ob) {
     return this.grid[this._key(ob.position)];
   }