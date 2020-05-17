const {__start, use} = (() => {
    const player = {
        x: {},
        y: {}
    }

    function use(init) {
        if(!player.x.color) {
            init(player.x)
        } else if(!player.y.color) {
            init(player.y)
        }
    }

    function __start() {
        // check x, y
        player.x.loop()
        player.y.loop()
    }
    return {use, __start}
})()