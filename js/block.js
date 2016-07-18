document.addEventListener('keydown', KeyDownFunc);
document.addEventListener('keyup', KeyUpFunc);
window.addEventListener('load',init);

document.addEventListener("DOMContentLoaded", function(){
	document.getElementById('canvas').addEventListener('touchstart', onDown, false);
});
document.addEventListener("DOMContentLoaded", function(){
	document.getElementById('canvas').addEventListener('touchend', onUp, false);
});

//---------------------------------------------------------//
//----------------------グローバル変数-----------------------//
//---------------------------------------------------------//

var WIDTH = 450;
var HEIGHT = 450;

var BLOCK_HEIGHT = 20;
var BLOCK_WIDTH = 40;

var canvas;
var ctx;

var key = new Array(256);
var KEY_RIGHT = 39;
var KEY_LEFT =37;

var my_bar;
var my_ball;
var my_block = [];
var SPEED = 2;
var BALL_SPEED = 8;
var left_touch = false;
var right_touch = false;

//---------------------------------------------------------//
//----------------------メインループ------------------------//
//---------------------------------------------------------//
function init(){
	canvas = document.getElementById('window');
	if(!canvas||!canvas.getContext) return false;
	ctx = canvas.getContext('2d');

	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	for(var i = 0; i < key.length; i++) key[i] = 0;

		my_bar = new bar(225,400,60);
	my_ball = new ball(200,350,5);

	for(var y = 0; y <= 5; y++){
		for(var x = 0; x <= 7; x++){
			var new_block = new block(85 + x*(BLOCK_WIDTH),50+ y*(BLOCK_HEIGHT));
			new_block.Set_Color((180/5)*y,(180/5)*y,(180/5)*y);
			my_block.push(new_block);
		}
	}

	requestAnimationFrame(update);
}

function update(){
	my_bar.Move();
	my_ball.Move();


	my_bar.Collision(my_ball);
	for(var i = 0; i < my_block.length; i++){
		if(my_block[i].render) my_block[i].Collision(my_ball);
	}
	my_ball.Collision_Wall();
	render();
	requestAnimationFrame(update);
}

function render(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	my_bar.Draw();
	my_ball.Draw();

	for(var i = 0; i < my_block.length; i++){
		if(my_block[i].render) my_block[i].Draw()
	}

}

//---------------------------------------------------------//
//----------------------オブジェクト-------------------------//
//---------------------------------------------------------//
function block(x,y){
	this.x = x;
	this.y = y;
	this.render = true;
	this.color;
	this.height = BLOCK_HEIGHT;
	this.width = BLOCK_WIDTH;
}

block.prototype.Draw = function(){
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x - (this.width/2),this.y - (this.height/2),this.width,this.height);

	ctx.beginPath();
	ctx.moveTo(this.x-this.width/2,this.y-this.height/2);
	ctx.lineTo(this.x-this.width/2,this.y+this.height/2);
	ctx.lineTo(this.x+this.width/2,this.y+this.height/2);
	ctx.lineTo(this.x+this.width/2,this.y-this.height/2);
	ctx.lineTo(this.x-this.width/2,this.y-this.height/2);
	ctx.stroke();

}
block.prototype.Set_Color = function (red,green,blue){
	this.color = 'rgb('+red+','+green+',' +blue+')';
}
block.prototype.Collision = function (ball){
	if(this.x - (this.width/2) <= ball.x && this.x + (this.width/2) >= ball.x && this.y-(this.height/2) >= ball.y && this.y-(this.height/2) <= ball.y+ball.size){
		ball.vel.y *= -1;
		ball.y = this.y - (this.height/2) - ball.size;
		this.render = false;
	}
	if(this.x - (this.width/2) <= ball.x && this.x + (this.width/2) >= ball.x && this.y+(this.height/2) <= ball.y && this.y+(this.height/2) >= ball.y-ball.size){
		ball.vel.y *= -1;
		ball.y = this.y + (this.height/2) + ball.size;
		this.render = false;
	}
	if(this.y - (this.height/2) <= ball.y && this.y + (this.height/2) >= ball.y && this.x+(this.width/2) <= ball.x && this.x+(this.width/2) >= ball.x-ball.size){
		ball.vel.x *= -1;
		ball.x = this.x + (this.width/2) + ball.size;
		this.render = false;
	}
	if(this.y - (this.height/2) <= ball.y && this.y + (this.height/2) >= ball.y && this.x-(this.width/2) >= ball.x && this.x-(this.width/2) <= ball.x+ball.size){
		ball.vel.x *= -1;
		ball.x = this.x - (this.width/2) - ball.size;
		this.render = false;
	}
}

function bar(x,y,size){
	this.x = x;
	this.y = y;
	this.size = size;
	this.speed = SPEED;
}
bar.prototype.Move = function(){
	if(key[KEY_LEFT]||left_touch) this.x -= this.speed;
	if(key[KEY_RIGHT]||right_touch)  this.x += this.speed;

	//画面外に出たら元に戻す
	if(this.x - (this.size/2) < 0) this.x = this.size/2;
	if(this.x + (this.size/2) > canvas.width) this.x = canvas.width - (this.size/2);
}
bar.prototype.Draw = function(){
	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fillRect(this.x - (this.size/2), this.y, this.size, 5);
}
bar.prototype.Collision = function(ball){
	if(this.x - (this.size/2) <= ball.x && this.x + (this.size/2) >= ball.x && this.y >= ball.y && this.y <= ball.y+ball.size){
		ball.vel.y *= -1;
		ball.y = this.y - ball.size;
		ball.vel.x += (ball.x-this.x)/40;
		if(BALL_SPEED-(ball.vel.x*ball.vel.x)>0){
			ball.vel.y = (ball.vel.y/Math.abs(ball.vel.y))*Math.sqrt(BALL_SPEED-(ball.vel.x*ball.vel.x));
		}else{
			ball.vel.y = (ball.vel.y/Math.abs(ball.vel.y))*Math.sqrt(0.5);
		}
	}
}

function ball(x,y,size){
	this.x = x;
	this.y = y;
	this.size = size;
	this.vel = new physics(2,2);
}
ball.prototype.Draw = function(){
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.size,0,Math.PI/180,true);
	ctx.stroke();
}
ball.prototype.Move = function(){
	this.x += this.vel.x;
	this.y += this.vel.y;
}
ball.prototype.Collision_Wall = function(){
	if(this.x - this.size < 0){
		this.x = this.size;
		this.vel.x *= -1;
	}
	if(this.x + this.size > canvas.width){
		this.x = canvas.width - this.size;
		this.vel.x *= -1;
	}
	if(this.y - this.size < 0){
		this.y = this.size;
		this.vel.y *= -1;
	}
}

function physics(x,y){
	this.x = x;
	this.y = y;
}

//---------------------------------------------------------//
//--------------------キーボードの入力-----------------------//
//---------------------------------------------------------//
function KeyDownFunc(e){
	key[e.keyCode]++;
}
function KeyUpFunc(e){
	for(var i = 0; i < 256; i++)
		key[i] = 0;
}
function onDown(e){

	for (var i = 0; i < e.touches.length; i++) {
		var touch = e.touches[i];
		console.log(touch.pageX);
		if(touch.pageX < WIDTH/2+canvas.offsetLeft){
			left_touch = true;
		}else{
			right_touch = true;
		}
	}

}
function onUp(e){
	right_touch = false;
	left_touch = false;
}

//---------------------------------------------------------//
//---------------------------------------------------------//