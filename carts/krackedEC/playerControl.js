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
            this.quadtree = kontra.quadtree({x: 0, y: 0, width: 32*10, height: 32*10});
            this.quadtree.add(walls)
        }
        let players = components.entitiesFrom(['playersprite', 'identity']);
        // TODO: For each player, make sure that it is not going to overlap with a wall
        //       in the direction that the player will be moving. We will do that by
        //       using self.quadtree.get({x: playerIdentity.x*playerIdentity, ditto y, width and height same})
        //       and then checking to see if anything gets returned. If its returned, we
        //       set that player sprite's velocity to 0.
        //       Should probably also only run this if the player sprite in question has a
        //       positive velocity.

    }
}

export default function setupPlayerControl(pokitOS) {
    pokitOS.baublebox.initializeSystem('playerwallcollision', new PlayerControlSystem(pokitOS));
}