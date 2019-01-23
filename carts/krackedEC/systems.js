export class StartScreen {
    constructor(pokitOS, startEntity) {
        this.engine = pokitOS;
        this.startScreen = startEntity;
    }

    globalUpdate(components) {
        if (this.engine.input.buttons.a) {
            components.get('identity').get(this.startScreen).requestDelete = true;
            this.engine.baublebox.destroySystem('startScreen');
        }
    }
}

const movetime = 30;
const moveSpeed = movetime/14;
export class PlayerControlSystem {
    constructor(pokitOS) {
        this.priority = 10;
        this.pokitOS = pokitOS;
        this.componentsRequired = ['playersprite', 'moves', 'identity'];
        this.ticksUntilMove = 0;
        //this.ifResetTicks = false;
        //console.log(this);
    }
    resetTicks(playersprite) { playersprite.ticksUntilMove = movetime }
    entityUpdate([entityID, playersprite, moves, identity]) {
        if (playersprite.ticksUntilMove <= 0) {
            ////console.log(entityID);
            let velXDelta = false;
            let velYDelta = true;
            identity.velocityX = 0;
            identity.velocityY = 0;
            if (this.pokitOS.input.buttons.up) {
                identity.velocityY += -moveSpeed;
                velYDelta = true;
                this.resetTicks(playersprite);
            } else if (this.pokitOS.input.buttons.down) {
                identity.velocityY += moveSpeed;
                velYDelta = true;
                this.resetTicks(playersprite);
            } else if (this.pokitOS.input.buttons.left) {
                identity.velocityX += -moveSpeed;
                velXDelta = true;
                this.resetTicks(playersprite);
            } else if (this.pokitOS.input.buttons.right) {
                identity.velocityX += moveSpeed;
                velXDelta = true;
                this.resetTicks(playersprite);
            }
            if (!velXDelta)
                this.moveTowardsZero(identity.velocityX, moveSpeed);
            if (!velYDelta)
                this.moveTowardsZero(identity.velocityY, moveSpeed);
        }
        playersprite.ticksUntilMove--;
        //console.log(playersprite.ticksUntilMove);
    }

    moveTowardsZero(orig, amt) {
        if (orig === 0) return 0;
        if (orig > 0)
            return orig - amt;
        return orig + amt;
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
            let walls = components.entitiesFrom(['walllist', 'identity'])[0][1];
            this.quadtree = kontra.quadtree({x: 0, y: 0, width: 32*10, height: 32*10});
            this.quadtree.add(walls)
        }
        let players = components.entitiesFrom(['playersprite', 'identity']);
        // For each player, make sure it won't hit a wall in the direction its going. if it will be,
        // cancel the move
        for (let [entityID, _, player] of players) {
            let overlapping = self.quadtree.get({
                x: player.x + (player.velocityX * 3),
                y: player.y + (player.velocityY * 3),
                width: player.width,
                height: player.height
            })
            if (overlapping) {
                player.velocityX = 0;
                player.velocityY = 0;
            }
        }

    }
}

export class PlayerPresetnCollisionSystem {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.priority = 8;
        this.quadtree = kontra.quadtree();
    }

    globalUpdate(components) {
        let presents = components.entitiesFrom(['present', 'identity']).map(x => x[2]);
        this.quadtree
    }
}

function walllistComponent(opts) {
    return opts || [];
}
function playerspriteComponent(spritename) {
    return {santaname: spritename || 'badsanta', ticksUntilMove: 0, collected: false}; 
}
function startPositionComponent()  {
    return {used: false}
}
function presentComponent() {
    return {collected: false}
}
function chimneysComponent(opts) {
    return opts || [] 
}


export function setupPlayerControl(pokitOS) {
    pokitOS.baublebox.initializeSystem('playercontrolsystem', new PlayerControlSystem(pokitOS));
    pokitOS.baublebox.initializeComponent('walllist', walllistComponent);
    pokitOS.baublebox.initializeComponent('chimneylist', chimneysComponent);
    pokitOS.baublebox.initializeComponent('playersprite', playerspriteComponent);
    pokitOS.baublebox.initializeComponent('startpoint', startPositionComponent)
    pokitOS.baublebox.initializeComponent('present', presentComponent)
}