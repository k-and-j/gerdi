use(p => {
    p.color = "aqua"
    p.loop = (data) => {
        // p.move()
        p.move(Math.random() * 800, Math.random() * 800);
    }
})