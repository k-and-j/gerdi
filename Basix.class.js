// ---------------------------//
//	   Layer Game Engine 	//
// --------------------------//

// author  : 0utlandish
// version : 1.4.0

// All basic things to create
// a graphical canvas
// animation

Array.prototype.extend = function (other_array) {
	other_array.forEach(function (v) {
		this.push(v);
	}, this);
};

Array.prototype.remove = function (element) {
	var index = this.indexOf(element);
	if (index > -1) {
		this.splice(index, 1);
	}
};

// Basix global functions and attributes
const Basix = {version: "1.4.0"};
Basix.layers = {
	counter: 1,
	list: {},
	add: args => {
		let def = {
			name: false
		}
		args = {...def, ...args};
		args.name = args.name ? args.name : `Layer ${Basix.layers.counter++}`
		let layer = new Basix.Layer(args);
		layer.animate();
		return layer.tick();
	}	
}
// Basix error logic manager
Basix.error = {
	add: (message) => {
		Basix.error.log.push({
			time: (new Date()).toLocaleTimeString(),
			message
		});
	},
	log: [],
	display: {
		last: (time = false) => {
			if (time)
				console.log(`%c[Basix] > %c${Basix.error.log[Basix.error.log.length-1].time} : %c${Basix.error.log[Basix.error.log.length-1].message}`, 'color: #E91E63', 'color: #1976D2', 'color: red');
			else 
				console.log(`%c[Basix] > %c${Basix.error.log[Basix.error.log.length-1].message}`, 'color: #E91E63', 'color: red');
		},
		all : (time = false) => {
			Basix.error.log.forEach((err) => {
				if (time)
					console.log(`%c[Basix] > %c${err.time} : %c${err.message}`, 'color: #E91E63', 'color: #1976D2', 'color: red');
				else 
					console.log(`%c[Basix] > %c${err.message}`, 'color: #E91E63', 'color: red');
			});
		}
	}
}
// a handy function to load images
Basix.image = {
	load: (src) => {
		let image = new Image();
		image.src = src;
		return image;
	}
}
// loads assets (image, sounds, ...)
Basix.resources = {
	log: true,
	list: {
		gfx: {},
		sfx: {}
	},
	load: async () => {
		Basix.resources.log && console.log('%c[Basix] > %cLoading resources : ', 'color: #E91E63', 'color: #333');
		let loadings = [];
		return new Promise(async (pass) => {
			for (let group in Basix.resources.list) {
				for (let res in Basix.resources.list[group]) {
					if (group == 'ready') continue;
					let load = new Promise((resolve, reject) => {
						Basix.resources.list[group][res].onload = () => {
							Basix.resources.log && console.log(`%c[Basix] > %c${group} : ${res} %c(Loaded)`, 'color: #E91E63', 'color: #1976D2', 'background: green;color: #fff;font-size: 9px');
							resolve(true);
						}
						Basix.resources.list[group][res].onerror = () => {
							Basix.resources.log && console.log(`%c[Basix] > %c${group} : ${res} %c(Error)`, 'color: #E91E63', 'color: #1976D2', 'background: red;color: #fff;font-size: 9px');
							Basix.resources.list[group][res] = res;
							resolve(false);
						}
					});
					loadings.push(load);
					await load;
				}
			}
			Promise.all(loadings).then(function(results) {
				if (!results.includes(false)) {
					Basix.resources.log && console.log('%c[Basix] > %cAll resources loaded successfully !', 'color: #E91E63', 'font-weight: bold;color: #00C000');
					pass(true);
				} else {
					Basix.resources.log && console.log('%c[Basix] > %cSome of the resources may not be loaded !', 'color: #E91E63', 'font-weight: bold;color: #C00000');
					pass(false);
				}
			});
		});
	}
}
Basix.mouse = {
	x: 0,
	y: 0
}

// every Layer is a canvas element with desired settings such as different FPS and TPS
// @parameter {string}     name 		: id of canvas element (not much important)
// @parameter {number}  width 		: width of canvas
// @parameter {number}  height 		: height of canvas
// @parameter {integer}   FPS 			: frames per second
// @parameter {integer}   TPs 			: ticks per second
// @parameter {boolean}  alpha 		: canvas context alpha activation
Basix.Layer = class {
	constructor(args) {
		const def = {
			name: 'default',
			width: window.innerWidth,
			height: window.innerHeight,
			autoFPS: false,
			FPS: 60,
			TPS: 120,
			alpha: false,
			monitor: false,
			clear: true
		}
		args = {...def, ...args};
		Basix.layers.list[args.name] 	= this;
		const body 				= document.querySelector('body');
		this.organ 				= document.createElement("canvas");  
		this.organ.style.position 		= "fixed";
		this.organ.style.left 			= 0;
		this.organ.style.top			= 0;
		this.monitor 				= document.createElement("span");  
		this.monitor.style.fontSize	= "10px";
		this.monitor.style.padding		= "5px";
		this.monitor.style.fontWeight	= "bold";
		this.monitor.style.fontFamily	= "monospace";
		this.monitor.style.color		= "#E1F5FE";
		this.monitor.style.background	= "#0000004E";
		this.monitor.innerText 		= "-";
		body.append(this.organ);
		document.querySelector("#status").append(this.monitor);
		this.name 					= args.name;
		this.width 				= args.width;
		this.height 				= args.height;
		this.alpha	 				= args.alpha;
		this.clear	 				= args.clear;
		this.organ.setAttribute("id", args.name);
		this.organ.setAttribute("width", this.width);
		this.organ.setAttribute("height", this.height);
		this.organ.setAttribute("oncontextmenu", "return false");
		this.xCenter 				= this.width / 2;
		this.yCenter 				= this.height / 2;
		this.elements 				= [];
		this.autoFrameRate 			= args.autoFrameRate;
		this.FPS 					= args.FPS;
		this.TPS 					= args.TPS;
		this.counter 				= 0;
		this.pause 				= false;
		this.tile 					= {
			visible: false,
			size: 32,
			width: 0.2,
			color: "#00AA00",
		};
		// camera offset
		this.camera 				= {x: 0, y: 0};
		// elements size scale
		this.scale 					= 1;
		// context of the canvas
		this.context 				= this.organ.getContext("2d", { alpha: this.alpha });
		// to read real fps & tps
		this.status = {
			display: (mood = true) => {
				this.monitor.style.display = mood ? "block" : "none";
				setInterval(() => {
					this.monitor.innerText = `${this.name} => FPS : ${this.status.fps.last} | TPS : ${this.status.tps.last} | REM : ${(() => {
						return this.elements.filter(e => e.visible).length
					}) ()}`;
				}, 1000);
			},
			fps: {
				counter: 0,
				last: null,
				start: (() => {
					setInterval(() => {
						this.status.fps.last = this.status.fps.counter;
						this.status.fps.counter = 0;
					}, 1000);
				}) ()
			},
			tps: {
				counter: 0,
				last: null,
				start: (() => {
					setInterval(() => {
						this.status.tps.last = this.status.tps.counter;
						this.status.tps.counter = 0;
					}, 1000);
				}) ()
			}
		}
		this.status.display(args.monitor);
	}
	// make all of its elements stop moving and pause animate and tick functions 
	freeze() {
		this.pause = true;
		this.elements.forEach(element => {
			element.stop();
		});
		return this;
	}
	// the logic of your creation executes here
	tick() {
		this.status.tps.counter++;
		if (!this.pause) {
			for (let i = 0; i < this.elements.length; i++) {
				this.elements[i].tick();
			}
		}
		const that = this;
		setTimeout(() => {
			that.tick();
		}, 1000 / this.TPS);
		return this;
	}
	// clear the canvas and paint again
	animate() {
		this.status.fps.counter++;
		if (!this.pause) {
			if (this.clear)
				this.context.clearRect(0, 0, this.width, this.height);
			if (this.tile.visible) {
				this.context.strokeStyle = this.tile.color;
				for (let i = 0; i < this.width / this.tile.size; i++) {
					this.context.lineWidth = this.tile.width;
					this.context.moveTo(0, i * this.tile.size);
					this.context.lineTo(this.width, i * this.tile.size);
					this.context.moveTo(i * this.tile.size, 0);
					this.context.lineTo(i * this.tile.size, this.height);
				}
				this.context.stroke();
				this.context.fill();
			}
			this.elements.forEach(element => {
				if (element.visible) 
					element.render(
						this.context,
						this.camera,
						this.scale
					);
			});
		}
		if (this.FPS) {
			const that = this;
			if (this.autoFPS) {
				window.requestAnimationFrame(() => {
					that.animate();
				});
			} else {
				setTimeout(() => {
					that.animate();
				}, 1000 / this.FPS);
			}
			return this;
		}
	}
}

// this class manages tileset image and make you able to draw it on canvas 
// @parameter {Image}    layer 		: Image object that you want to fuck the tileset out of it
// @parameter {number}  tileSize 	: size of every tile
Basix.Tileset = class {
	constructor(args) {
		const def = {
			image: null,
			tileSize: 32
		}
		args 			= {...def, ...args}
		this.tileSize 	= args.tileSize;
		this.image 	= args.image;
	}
	draw(args) {
		const def = {
			layer: null,
			i: 0,
			j: 0,
			x: 0,
			y: 0,
			size: this.tileSize
		}
		args = {...def, ...args};
		args.layer.context.drawImage(this.image, args.i * this.tileSize, args.j * this.tileSize, this.tileSize, this.tileSize, args.x, args.y, args.size, args.size);
		return this;
	}
	tileDraw(args) {
		const def = {
			layer: null,
			i: 0,
			j: 0,
			x: 0,
			y: 0
		}
		args = {...def, ...args};
		args.layer.context.drawImage(this.image, args.i * this.tileSize, args.j * this.tileSize, this.tileSize, this.tileSize, args.x * this.tileSize, args.y * this.tileSize, this.tileSize, this.tileSize);
		return this;
	}
}

// this Element class has the main attributes of every element that is going to be created
// @parameter {strinf}    		layer 		: layer name in which your element will be rendered
// @parameter {number}    	x 			: x position of the element
// @parameter {number}    	y 			: y position of the element
// @parameter {number}    	size 			: size of the element
Basix.Element = class {
	constructor(args) {
		const def = {
			layer 	: "default",
			x 		: 0,
			y 		: 0,
			size 		: 0
		}
		args 			= {...def, ...args};
		if (Basix.layers.list[args.layer] == undefined) {
			Basix.error.add(`Layer '${args.layer}' is not defined !`);
		}
		Basix.layers.list[args.layer].elements.push(this);
		this.layer 	= Basix.layers.list[args.layer];
		this.x 		= args.x;
		this.y 		= args.y;
		this.size 		= args.size;
		this.counter	= 0;
		this.visible 	= true;
		this.freeze 	= true;
		this.idle 		= true;
		this.focused	= false;
		this.stop 		= () => {};
	}
	// removes element from layers element list
	remove() {
		this.stop();
		this.layer.elements.remove(this);
	}
	// preform several move in sequence
	// @parameter {number}  x 			: destination x
	// @parameter {number}  y 			: destination y
	// @parameter {number}  duration 		: duration till element reach the destination (in 0.01s => 100 will be 1sec)
	// @parameter {boolean}  relative		: if true destination x and y are relative to the current element position
	// @parameter {function} 	callback		: this function will be called after movement finished or element is stopped, pass true as input if element reached the destination and false if element is stopped 
	moveByDuration(args) {
		this.stop();
		return new Promise((resolve) => {
			const def = {
				x: 0,
				y: 0,
				duration: 100,
				relative: false,
				callback: ()=>{}
			}
			args = {...def, ...args};
			if (args.relative) {
				args.x += this.x;
				args.y += this.y;
			}
			if (this.x == args.x && this.y == args.y) return true;
			const slop 	= Math.abs((args.y - this.y) / (args.x - this.x));
			const distance 	= ((args.y - this.y) ** 2 +(args.x - this.x) ** 2) ** 0.5;
			const speed 	= distance / args.duration;
			const angle 	= Math.atan(slop) * (180 / Math.PI);
			const xs 		=  Math.sign(args.x - this.x) * Math.cos(angle / (180 / Math.PI));
			const ys 		=  Math.sign(args.y - this.y) * Math.sin(angle / (180 / Math.PI));
			let driver 		= setInterval(() => {
				this.x += speed * xs;
				this.y += speed * ys;
			}, 10);
			this.stop = (status = false) => {
				if (driver) {
					args.callback(status);
					clearInterval(driver);
					driver = false;
					resolve(true);	
				}
			}
			setTimeout(this.stop, args.duration * 10, true);
		});
	}
	// preform several move in sequence
	// @parameter {number}  x 			: destination x
	// @parameter {number}  y 			: destination y
	// @parameter {number}  speed 		: movement speed (pixels per 0.01s)
	// @parameter {boolean}  relative		: if true destination x and y are relative to the current element position
	// @parameter {function} 	callback		: this function will be called after movement finished or element is stopped, pass true as input if element reached the destination and false if element is stopped 
	moveBySpeed(args, priority = true) {
		if (priority)
			this.stop();
		return new Promise((resolve) => {
			const def = {
				x: 0,
				y: 0,
				speed: 10,
				relative: false,
				callback: ()=>{}
			}
			args = {...def, ...args};
			if (args.relative) {
				args.x += this.x;
				args.y += this.y;
			}
			if (this.x == args.x && this.y == args.y) return true;
			const slop 	= Math.abs((args.y - this.y) / (args.x - this.x));
			const distance 	= ((args.y - this.y) ** 2 +(args.x - this.x) ** 2) ** 0.5;
			const duration 	= distance / args.speed;
			const angle 	= Math.atan(slop) * (180 / Math.PI);
			const xs		=  Math.sign(args.x - this.x) * Math.cos(angle / (180 / Math.PI));
			const ys 		=  Math.sign(args.y - this.y) * Math.sin(angle / (180 / Math.PI));
			let driver 	= setInterval(() => {
				this.x += args.speed * xs;
				this.y += args.speed * ys;
			}, 10);
			this.stop = (status = false) => {
				if (driver) {
					args.callback(status);
					clearInterval(driver);
					driver = false;
					resolve(true);	
				}
			}
			setTimeout(this.stop, duration * 10 + 5, true);
		});
	}
	// preform several move in sequence
	// @parameter {integer} cycle			: if loop is false, determine how many time task should repeat (set to Infinity if you want it to loop for ever)
	// @parameter {arrays->object} moves 	: store moves values
	// @parameter {number} x 			: destination x
	// @parameter {number} y 			: destination y
	// @Note : on of this are allowed to use in the move args
	// @parameter {number} speed 		: movement speed
	// @parameter {number} duration 		: movement duration
	task(args) {
		const def = {
			moves: [],
			cycle: 1,
			priority: false,
			callback: () => {}
		}
		if (this.idle != true) {
			return false;
		}
		args = {...def, ...args};
		this.idle = false;
		let task = (async function (that) {
			const numberOfMoves = args.moves.length;
			const i = 0;
			const x = 0;
			while (i < numberOfMoves && !that.idle) {
				if (that.idle == false) {
					if (args.moves[i].duration == undefined) {
						await that.moveBySpeed({
							x: args.moves[i].x,
							y: args.moves[i].y,
							speed: args.moves[i].speed,
							callback: () => {
								i++;
							}
						});
					} else {
						await that.moveByDuration({
							x: args.moves[i].x,
							y: args.moves[i].y,
							duration: args.moves[i].duration,
							callback: () => {
								i++;
							}
						});
					}
				}
				if (i == numberOfMoves && !that.idle) {
					i = 0;
					x++;
				}
				if (args.cycle == x) {
					that.idle = true;
				}
			}
		}) (this);
		task.then(args.callback);
		return this;
	}
	keydown() {
		// must be overwrite
	}
	keyup() {
		// must be overwrite
	}
	mousedown() {
		// must be overwrite
	}
	mouseup() {
		// must be overwrite
	}
	mousemove() {
		// must be overwrite
	}
	render() {
		// must be overwrite
	}
	tick() {
		// must be overwrite
	}
}

// initialize defualtLayer
Basix.init = () => {
	Basix.layers.add({
		name: 'default',
		autoFPS: true,
		TPS: 60,
		monitor: true
	});
}

document.addEventListener('mousemove', e => {
	Basix.mouse.x = e.offsetX;
	Basix.mouse.y = e.offsetY;
	for (name in Basix.layers.list) {
		Basix.layers.list[name].elements.forEach(element => {
			element.mousemove(e);
		});
	}
});

document.addEventListener('mousedown', e => {
	for (name in Basix.layers.list) {
		Basix.layers.list[name].elements.forEach(element => {
			element.mousedown(e);
		});
	}
});

document.addEventListener('mouseup', e => {
	for (name in Basix.layers.list) {
		Basix.layers.list[name].elements.forEach(element => {
			element.mouseup(e);
		});
	}
});

// keydown event listener 
document.addEventListener('keydown', e => {
	for (name in Basix.layers.list) {
		Basix.layers.list[name].elements.forEach(element => {
			element.keydown(e);
		});
	}
});

// keyup event listener 
document.addEventListener('keyup', e => {
	for (name in Basix.layers.list) {
		Basix.layers.list[name].elements.forEach(element => {
			element.keyup(e);
		});
	}
});

const body 				= document.querySelector('body');
body.onselectstart 			= function() { return(false); };
body.style.margin		 	= 0;
body.style.padding 			= 0;
body.style.backgroundColor 	= "#E91E63";
let status 					= document.createElement("span");
status.setAttribute("id", "status");
status.style.position 			= "fixed";
status.style.left 			= 0;
status.style.top 			= 0;
status.style.zIndex 			= 1;
body.append(status);

console.info(`%c■ Powered by %cBasix %c${Basix.version}`, 'font-weight: bold', 'color: #E91E63;font-weight: bold', 'background: #00E676;color: #FFF;border-radius: 50px;font-size:9px;padding:2px 5px;');

// Basix is ready to use