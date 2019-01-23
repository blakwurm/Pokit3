let messager = new MessageChannel();
let port = messager.port1;
let worker1 = createWorker(function(e) {
    let p = e.ports[0]
    p.onmessage = function(a) {
        //console.log(a)
    }
})
let thing = {foo: "bar", bar: "bar", dede: 'fwomp'}
//console.log(thing)

//console.log('sending thing')
worker1.postMessage({t:null}, [messager.port2])
console.time('foo')
port.postMessage(thing)
console.timeEnd('foo')
thing.foo = "baz"
//console.log(thing)

function createWorker(fn) {
    var blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
    var url = URL.createObjectURL(blob);
    
    return new Worker(url);
  }