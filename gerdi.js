
Array.prototype.remove = function (element) {
	var index = this.indexOf(element);
	if (index > -1) {
		this.splice(index, 1);
	}
};

class Gerdi extends Basix.Element {
	constructor(x, y, size = 20, color = "white") {
		super({layer: "Arena", x, y, size});
		this.color = color;
		this.bullets = [];
	}
	render(context) {
		context.beginPath();
		context.fillStyle = this.color;
		context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		context.fill();
	}
}

class Bullet extends Basix.Element {
	constructor(player, dx, dy, range = 500) {
		super({layer: "Arena", x: player.x, y: player.y, size: 6});
		this.angle = -Math.atan2(dy - player.y, dx - player.x) * 180 / Math.PI;
		if (this.angle < 0) {
			this.angle = 180 - (-180 - this.angle)
		}
		this.player = player;
		this.angle = -this.angle / (180 / Math.PI);
		this.player.bullets.push(this);
		this.moveBySpeed({
			relative: true,
			x: Math.cos(this.angle) * range,
			y: Math.sin(this.angle) * range,
			speed: 1.5
		}).then(() => {
			this.player.bullets.remove(this);
			this.remove();
		});
	}
	render(context) {
		context.strokeStyle = this.player.color;
		context.strokeRect(this.x, this.y, this.size, this.size);
	}
	tick() {
		if (((this.x - this.player.opponent.x) ** 2 + (this.y - this.player.opponent.y) ** 2) ** 0.5 <= this.size + this.player.opponent.size) {
			this.player.opponent.remove();
		}
		// console.log(this.player.opponent);
	}
}