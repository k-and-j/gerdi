use(p => {
    p.color = "firebrick"
    p.loop = (data) => {
        // p.move()
        p.move(Math.random() * 800, Math.random() * 800);
    }
})