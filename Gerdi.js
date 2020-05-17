
class Gerdi extends Basix.Element {
	constructor(x, y, size, color = "white") {
		super({layer: "Arena", x, y, size: 30});
		this.color = color;
	}
	render(context) {
		context.fillStyle = this.color;
		context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		context.fill();
	}
}