const {__start, use} = (() => {
    const delay = 1;
    const _x = new Gerdi(); 
    const _y = new Gerdi();

    const player = { x: {}, y: {} }
    
    function use(init) {
        if(!player.x.color) {
            init(player.x)
        } else if(!player.y.color) {
            init(player.y)
        }
    }

    function pass(p, _p, op, _op) {
        // p: player, _p: gerdi, op: opponent, _op: opponent gerdi
        p.data = {
            ox: _op.x,
            oy: _op.y,
            x: _p.x,
            y: _p.y
        }
        p.move = (x, y) => {
            _p.moveBySpeed({
                x,
                y,
                relative: true,
                speed: 0.8
            });
            p.move = () => {}
        }
    }

    function __start() {
        const {x, y} = player;
        _x.color = x.color;
        _y.color = y.color;
        setInterval(() => {
            pass(x, _x, y, _y)
            pass(y, _y, x, _x)
            x.loop();
            y.loop();
        }, delay * 1000);
    }
    return {use, __start}
})()