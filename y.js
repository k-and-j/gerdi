use(p => {
    p.color = "aqua"
    p.loop = () => {
        // p.move()
        p.move(Math.random() * 800, Math.random() * 800);
    }
})