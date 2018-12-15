export class GameCart {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
    }
    async preload() {
        console.log('loaded!');
        let img = await this.pokitOS.bellhop.loadImage('testmapimage', '/carts/basictiles.png');
        this.pokitOS.baublebox.initializeSystem('testTiler', new this.pokitOS.baublebox.TileMapRenderer(this.pokitOS.gamescreen, img));
        let mp = await this.pokitOS.bellhop.loadTiledMap('testmap', '/carts/testmap.json');
        this.pokitOS.baublebox.makeEntity({x: 120, y: 80, z: 5, width: 16, height: 16})
                            ('tile', {index: 20});
        this.pokitOS.baublebox.makeEntity({x: 140, y: 80, z: 5, width: 16, height: 16})
                            ('tile', {index: 21});
        this.pokitOS.baublebox.makeEntity({x: 160, y: 80, z: 5, width: 16, height: 16})
                        ('tile', {index: 22});
        this.pokitOS.baublebox.makeEntity({})
                ('tilemap', mp)
        console.log(mp);
    }
    start() {
        console.log('mainstart');
    }
}