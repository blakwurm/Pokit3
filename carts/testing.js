class TestCart extends GameCart {
    constructor() {
        super('Testing Game');
    }
    preload() {
        console.log('loaded!');
    }
    start() {
        console.log('mainstart');
    }
}
let tc = new TestCart();