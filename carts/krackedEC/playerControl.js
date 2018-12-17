const movetime = 320/16;
const moveSpeed = movetime/16;
export class PlayerControlSystem {
    constructor(pokitOS) {
        this.priority = 10;
        this.pokitOS = pokitOS;
        this.componentsRequired = ['playersprite', 'moves', 'identity'];
        this.ticksUntilMove = 0;
    }
    resetTicks() {this.ticksUntilMove = movetime;}
    entityUpdate([entityID, playersprite, moves, identity]) {
        if (this.ticksUntilMove <= 0) {
            identity.velocityX = 0;
            identity.velocityY = 0;
            if (this.pokitOS.input.buttons.up) {
                identity.velocityY = moveSpeed;
                this.resetTicks();
            } else if (this.pokitOS.input.buttons.down) {
                identity.velocityY = -moveSpeed;
                this.resetTicks();
            } else if (this.pokitOS.input.buttons.left) {
                identity.velocityX = moveSpeed;
                this.resetTicks();
            } else if (this.pokitOS.input.buttons.right) {
                identity.velocityX = -moveSpeed;
                this.resetTicks();
            }
        }
    }
}

export class PlayerWallCollisionSystem {
    constructor(pokitOS) {
        this.priority = 9;
        this.pokitOS = pokitOS;
        this.quadtree = null;
    }
    globalUpdate(components) {
        if (!this.quadtree) {
            let walls = components.entitiesFrom(['wallsprite', 'identity']).map((x) => x[1]);
            this.quadtree = kontra.quadtree();
            this.quadtree.add(walls)
        }
        let players = components.entitiesFrom(['playersprite', 'identity']);

    }
}

export default function setupPlayerControl(pokitOS) {
    pokitOS.baublebox.initializeSystem('playerwallcollision', new PlayerControlSystem(pokitOS));
}