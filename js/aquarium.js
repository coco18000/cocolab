window.addEventListener('load',init) ;

//------------------------------------------------//
//------------------------------------------------//
var WIDTH = 450;
var HEIGTH = 300;

var canvas;
var ctx;

var fishes = [];
//------------------------------------------------//
//------------------------------------------------//

function fish(x,y,size,speed,direct){
	this.x = x;
	this.y = y;
	this.size = size;
	this.direct = direct;
	this.speed = speed;
}
fish.prototype.Draw = 	function (){
	ctx.lineWidth = 1.5;
	ctx.fillRect(this.x+(this.direct*this.size*2/3),this.y-(this.size/10),2,2);
	ctx.beginPath();
	ctx.moveTo(this.x+this.direct*this.size,this.y);
	ctx.quadraticCurveTo(this.x,this.y+this.size,this.x-this.direct*this.size,this.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(this.x-this.size,this.y);
	ctx.quadraticCurveTo(this.x,this.y-this.size,this.x+this.size,this.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(this.x-this.direct*this.size,this.y);
	ctx.lineTo(this.x-this.direct*this.size-(this.direct*this.size/5),this.y-(this.size/5));
	ctx.lineTo(this.x-this.direct*this.size-(this.direct*this.size/5),this.y+(this.size/5));
	ctx.lineTo(this.x-this.direct*this.size,this.y);
	ctx.stroke();
}
fish.prototype.Move = function (){
	this.x+=(this.direct*this.speed);
	if(this.x-this.size<20||this.x+this.size>WIDTH-20)this.direct*=-1;
}

function air(x,y,size){
	this.x=x;
	this.y=y;
	this.size=size;
	function Draw(){
		ctx.beginPath();
		ctx.arc(x,y,size,0,Math.PI/180,true);
		ctx.stroke();
	}
}


function init() {
	canvas = document.getElementById('Aquarium');
	if(!canvas || !canvas.getContext) return false;
	ctx = canvas.getContext('2d');

	canvas.width = WIDTH;
	canvas.height = HEIGTH;

	var fish_num = Math.floor(Math.random()*9)+1;
	for(var i=0;i<fish_num;i++){
		var x = Math.floor(Math.random()*(WIDTH-140))+70;
		var y = Math.floor(Math.random()*(HEIGTH-40))+20;
		var size  = Math.floor(Math.random()*30)+5;
		var speed = Math.random()+0.05;

		var direct = Math.random();
		if(direct>0.5) {
			direct = -1;
		}else{
			direct = 1;
		}

		var new_fish = new fish(x,y,size,speed,direct);
		fishes.push(new_fish);
	}
	requestAnimationFrame(update);
}

function update() {
	var num = fishes.length;
	for(var i=0;i<num;i++){
		fishes[i].Move();
	}
	requestAnimationFrame(update);
	render();
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var num = fishes.length;
	for(var i=0;i<num;i++){
		fishes[i].Draw();
	}
}