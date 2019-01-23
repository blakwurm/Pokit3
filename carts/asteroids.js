// following https://medium.com/web-maker/making-asteroids-with-kontra-js-and-web-maker-95559d39b45f

let input = document.pokitOS.input;
let asteroids = [];
let sprites = [];
let ship = null;

function makeAsteroid () {
    let asteroid = kontra.sprite({
        type: 'asteroid',
        x: 20,
        y: 20,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        ttl: Infinity,
        render() {
            this.context.strokeStyle = "white";
            this.context.beginPath();
            this.context.arc(this.x, this.y, 20, 0, Math.PI*2);
            this.context.stroke();
        }
    })
    sprites.push(asteroid);
}

let degreesToRadians = (degrees) => degrees * Math.PI / 180;

function makePlayer () {
    ship = kontra.sprite({
       type: 'ship',
       x: 160,
       y: 160,
       width: 6,
       rotation: 0,
       ttl: Infinity,
       dt: 0,
       render() {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.rotate(degreesToRadians(this.rotation));
            this.context.beginPath();
            this.context.moveTo(-3, -5);
            this.context.lineTo(12, 0);
            this.context.lineTo(-3, 5);
        
            this.context.closePath();
            this.context.stroke();
            this.context.restore();
       },
       update() {
           if (input.buttons.left) {
               this.rotation += -4
           }
           if (input.buttons.right) {
               this.rotation += 4
           }
           this.cos = Math.cos(degreesToRadians(this.rotation));
           this.sin = Math.sin(degreesToRadians(this.rotation));
           if (input.buttons.b) {
               this.ddx = this.cos * 0.1;
               this.ddy = this.sin * 0.1;
           } else {
               this.ddx = this.ddy = 0;
           }

           this.advance();

           const magnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
           if (magnitude > 10) {
               this.dx *= 0.95;
               this.dy *= 0.95;
           }
           
           this.dt += 1/60;
           if (input.buttons.a && this.dt > 0.25) {
               this.dt = 0;
               makeBullet(this);
           }
       }
   })
   sprites.push(ship);
}

function makeBullet(ship) {
    let bullet = kontra.sprite({
        type: 'bullet',
        x: ship.x + ship.cos * 12,
        y: ship.y + ship.sin * 12,
        dx: ship.dx + ship.cos * 5,
        dy: ship.dy + ship.sin * 5,
        ttl: 60 * 0.75,
        width: 4,
        height: 4,
        color: 'white'
    })
    sprites.push(bullet);
    return bullet;
}

let cart = {
    init: async function() {
       //console.log("%c I AM ALIVE!", "color: red"); 
       for (var i = 0; i < 10; i++) {
           makeAsteroid();
       }
       makePlayer();
       //console.log(kontra);
    },
    update: function() {
        sprites.forEach(sprite => {
            sprite.update();
            if (sprite.x < 0) {
                sprite.x = kontra.canvas.width;
            }
            if (sprite.x > kontra.canvas.width) {
                sprite.x = 0;
            }
            if (sprite.y < 0) {
                sprite.y = kontra.canvas.height;
            }
            if (sprite.y > kontra.canvas.height) {
                sprite.y = 0;
            }
            sprites = sprites.filter(sprite => sprite.isAlive());
        })
    },
    render: function() {
        sprites.map(sprite => sprite.render());
    }
}
document.pokitOS.gamecart = cart;
document.debugflag = 'my name... is Beowulf!';