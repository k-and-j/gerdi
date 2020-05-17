const {__start, use} = (() => {
    const delay = 1;
    const _x = new Gerdi(); 
    const _y = new Gerdi(); 
    const player = {
        x: {
            move: (x, y) => {
                _x.moveBySpeed({
                    x,
                    y,
                    relative: true,
                    speed: 0.8
                });
            }
        },
        y: {
            move: (x, y) => {
                _y.moveBySpeed({
                    x,
                    y,
                    relative: true,
                    speed: 0.8
                });
            }
        }
    }

    function use(init) {
        if(!player.x.color) {
            init(player.x)
        } else if(!player.y.color) {
            init(player.y)
        }
    }

    function __start() {
        const {x, y} = player;
        _x.color = x.color;
        _y.color = y.color;
        setInterval(() => {
            player.x.loop({
                ox: _y.x,
                oy: _y.y,
            });
            player.y.loop({
                ox: _x.x,
                oy: _x.y,
            });
        }, delay * 1000);
    }
    return {use, __start}
})()