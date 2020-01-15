import {SpatialHash} from 'spatialhash.js'
import { PokitOS } from './pokitos';

function getReference(obj1, obj2){
    return obj1.id + '.' + obj2.id;
}
export let collisionSystem = {
    init:(engine: PokitOS)=>{
        this.engine = engine;
        this.map = new SpatialHash(120);
        this.collisions = new Map();
    },
    update:(entities)=>{
        this.map.clear();
        let colliders = entities.filter(x=>x.flags.has('collidable'));
        this.map.addMany(colliders);
        Array.prototype.forEach(x=>x.collided=false, this.collisions.values());
        for(let collider of colliders){
            for(let collision of this.map.findColliding(collider)){
                if(collider !== collision){
                    if(!this.collisions.get(getReference(collider, collision))){
                        collider.onCollisionEnter(collider, collision);
                    }
                    this.collisions.set(getReference(collider, collision), {collider:collider,collision:collision,collided:true});
                }
            }
        }
        for(let collisionKey of this.collisions.keys()){
            let collision = this.collisions.get(collisionKey);
            if(!collision.collided){
                collision.collider.onCollisionExit(collision.collider, collision.collision)
                this.collisions.delete(collisionKey);
            }
        }
    }
}