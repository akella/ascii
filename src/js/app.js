
import perlin from './lib/perlin';
function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

class ASC {
  constructor() {
  	let self = this;
    this.time = 0;

    this.x = 10;
    this.y = 10;

    this.py = 0;
    this.px = 0;
    this.radius = 0;
    this.state = [];
    this.string = " aÃ bcdeÃ¨Ã©fghiÃ¬jklmnoÃ²pqrstuÃ¹Ã¼vwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%/|\\()#?!\"'â€œâ€â€˜â€™;:Ï€*+â€¢â€”-_,. ";

    this.S = {
    	list: Array.from(self.string),
    	map: new Map(
    		Array.from(self.string).map(function(a,b) {
    			return [a,b];
    		})
    	),
    	length: self.string.length
    };

    this.space = this.S.map.get(' ');
    this.zero = this.S.map.get('0');
    this.one = this.S.map.get('1');

    this.output = document.querySelector('output') || document.body.appendChild(
    	document.createElement('output')
    );


    this.setsizes();
    this.initCanvas();
    this.bindMouse();
    this.update();
  }
  initCanvas() {
  	this.canvas = document.createElement('canvas');
  	this.ctx = this.canvas.getContext('2d');
  	this.canvas.height = this.rows;
  	this.canvas.width = this.cols;
  	document.body.appendChild(this.canvas);
  }

  drawCanvas() {
  	let shiftCoordsX = Math.floor(this.cols/2) + 5*Math.sin(this.time/50) - 20;
  	let shiftCoordsY = Math.floor(this.rows/2) + 5*Math.cos(this.time/50) - 10;
  	this.ctx.clearRect(0,0,this.cols,this.rows);
  	this.ctx.fillStyle = '#000000';
  	this.ctx.fillRect(0,0,this.cols,this.rows);
  	this.ctx.fillStyle = '#ffffff';
  	this.ctx.fillRect(0 + shiftCoordsX,0 + shiftCoordsY,3 + shiftCoordsX,2 + shiftCoordsY);

  	let data = this.ctx.getImageData(0,0,this.cols,this.rows).data;
  	for (var i = 0; i < this.rows; i++) {
  		for (var j = 0; j < this.cols; j++) {
  			let nom = 4*(i*this.cols + j);
  			let symbol = Math.floor(map_range(data[nom],0,255,0, this.one));
  			if( (i+j+1)%2===0 && symbol!==0 ) {
  				this.state[i][j] = symbol;
  			}
  			
  		}
  	}

  	console.log(data);

  }
  bindMouse() {
  	document.addEventListener('mousemove',(e) => {
  		this.x = e.clientX;
  		this.y = e.clientY;
  	});
  }

  setsizes() {
  	let self = this;

  	let measureDiv = document.createElement('div');
  	measureDiv.style.cssText = 'position:absolute;display:block;white-space: pre;';
  	measureDiv.innerHTML = 'X'.repeat(100);
  	measureDiv.innerHTML += 'X\n'.repeat(99);
  	document.body.appendChild(measureDiv);



  	this.charWidth = measureDiv.offsetWidth/100;
  	this.lineHeight = measureDiv.offsetHeight/100;
  	this.aspect = this.charWidth/this.lineHeight;
  	document.body.removeChild(measureDiv);



  	this.rows = Math.floor(window.innerHeight/this.lineHeight);
  	this.cols = Math.floor(window.innerWidth/this.charWidth);

  	for (var i = 0; i < this.rows; i++) {
  		this.output.appendChild(document.createElement('span'));
  		this.state.push(
  			new Array(self.cols).fill(self.zero)
  		);
  		
  	}
  	for (var i = 0; i < this.rows; i++) {
	  	for (var j = 0; j < this.cols; j++) {
	  		self.state[i][j] = Math.floor(120*perlin(i/10,j/10,0));
	  	}
  	}
  	// console.log(this);
  }


  draw() {

  	// draw state
  	for (var i = 0; i < this.rows; i++) {
  		let row = this.output.childNodes[i];
  		let res = '';
  		for (var j = 0; j < this.cols; j++) {
  			let nomer = this.state[i][j];
  			res += this.S.list[nomer];
  		}
  		if(row.innerHTML!==res) row.innerHTML = res;
  		
  	}

  	// cooldown
  	for (var i = 0; i < this.rows; i++) {
  		for (var j = 0; j < this.cols; j++) {
  			if(this.state[i][j]<this.S.length -1) {
  				this.state[i][j] = ++this.state[i][j] % this.S.length;
  			}

  		}
  	}

  }

  calculate() {
  	let self = this;
  	let x = Math.floor(self.x/self.charWidth);
  	let y = Math.floor(self.y/self.lineHeight);
  	// console.log(x,y);
  	let raduis = 5;

  	let distance = Math.sqrt(Math.pow(self.px - self.x,2) + Math.pow(self.py - self.y,2));
  	console.log(distance);
  	this.radius += 0.05*(distance-this.radius);
  	if(this.radius<0) this.radius = 0;
  	// this.state[y][x] = this.zero;
  	for (var i = 0; i < this.rows; i++) {
  		for (var j = 0; j < this.cols; j++) {
  			let dist = Math.sqrt((x-j)*(x-j) + ((y-i)/this.aspect)*((y-i)/this.aspect));
  			if(dist<this.radius) {
  				if((i+j)%2===0) {
  					this.state[i][j] = this.zero;
  				}
  				
  			}
  		}
  	}

  	this.px = this.x;
  	this.py = this.y;

  }

  update() {
    this.time++;
    // console.log(this.time);
    this.calculate();
    this.draw();
    this.drawCanvas();
    // console.log(this.x,this.y);
    requestAnimationFrame(this.update.bind(this));
  }
}

let asc = new ASC();
