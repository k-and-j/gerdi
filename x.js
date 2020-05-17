use(p => {
    p.color = "firebrick"
    p.loop = () => {
        p.data.op
        // p.move()
        p.move(Math.random() * 800, Math.random() * 800);
        // console.log(p)
    }
})