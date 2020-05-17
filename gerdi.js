
class Gerdi extends Basix.Element {
	constructor(x, y, size, color = "white") {
		super({layer: "Arena", x: 0, y: 0, size: 30});
		this.color = color;
	}
	render(context) {
		context.beginPath();
		context.fillStyle = this.color;
		context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		context.fill();
	}
}

class Bullet extends Basix.Element {
	constructor
}