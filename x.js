use(p => {
    p.color = "firebrick"
    p.loop = () => {
        p.data.op
        // p.move()
        p.move(100, 100);
        p.shoot(p.data.ox, p.data.oy);
        // console.log(p)
    }
})