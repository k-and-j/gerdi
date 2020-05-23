use(p => {
    p.color = "firebrick"
    p.loop = () => {
        
        p.move(100, 100);
        p.shoot(p.data.ox, p.data.oy);
    }
})