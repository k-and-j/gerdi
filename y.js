use(p => {
    p.color = "aqua"
    const bullet_speed = 1.5
    const op = {
        dx: 0, dy: 0,
        px: 0, py: 0
    }
    const rnd = (a, b) => Math.random() * (b - a) + a
    p.loop = () => {
        const {data, move, shoot} = p;
        
        op.dx = data.ox - op.px
        op.dy = data.oy - op.py
        
        move(rnd(100, data.screenwidth - 100) - data.x, rnd(100, data.screenheight - 100) - data.y)
        shoot(data.ox + op.dx, data.oy + op.dy)

        op.px = data.ox;
        op.py = data.oy;
    }
})