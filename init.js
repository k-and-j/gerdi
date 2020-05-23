const {__start, use} = (() => {
    const delay = 1;
    const _x = new Gerdi(100, Basix.layers.list.Arena.height / 2 - 10); 
    const _y = new Gerdi(Basix.layers.list.Arena.width - 100, Basix.layers.list.Arena.height / 2 - 10);

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
        _p.opponent = _op;
        p.data = {
            ox: _op.x,
            oy: _op.y,
            x: _p.x,
            y: _p.y,
            screenwidth: _p.layer.width,
            screenheight: _p.layer.height,
        }
        p.move = (x, y) => {
            if (_p.x + x + _p.size <= _p.layer.width && _p.y + y + _p.size <= _p.layer.height && _p.x + x - _p.size >= 0 && _p.y + y - _p.size >= 0) {
                _p.moveBySpeed({
                    x,
                    y,
                    relative: true,
                    speed: 0.8
                });
            }
            p.move = () => {}
        }
        p.shoot = (dx, dy) => {
            new Bullet(_p, dx, dy);
            p.shoot = () => {}
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