// following https://medium.com/web-maker/making-asteroids-with-kontra-js-and-web-maker-95559d39b45f

let kontra = null;
let input = null;
let asteroids = [];
let sprites = [];
let ship = null;

function makeAsteroid () {
    let asteroid = kontra.sprite({
        x: 20,
        y: 20,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
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
       x: 160,
       y: 160,
       width: 6,
       rotation: 0,
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
       }
   })
   sprites.push(ship);
}

let cart = {
    init: function() {
       console.log("%c I AM ALIVE!", "color: red"); 
       kontra = this.kontra;
       input = this.input;
       for (var i = 0; i < 10; i++) {
           makeAsteroid();
       }
       makePlayer();
       console.log(kontra);
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
        })
    },
    render: function() {
        sprites.map(sprite => sprite.render());
    }
}
document.cart = cart;
document.debugflag = 'my name... is Beowulf!';