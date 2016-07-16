document.addEventListener('keydown', KeyDownFunc);
document.addEventListener('keyup', KeyUpFunc);
window.addEventListener('load',init);

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
var KEY_LEFT = 39;
var KEY_RIGHT =37;

var my_bar;
var my_ball;
var my_block = [];
var SPEED = 2;
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
	ctx.fillRect(this.x - (this.width/2),this.y - (this.height/2),this.width,this.height);

}
block.prototype.Set_Color = function (red,green,blue){

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
	if(key[KEY_RIGHT]) this.x -= this.speed;
	if(key[KEY_LEFT])  this.x += this.speed;

	//画面外に出たら元に戻す
	if(this.x - (this.size/2) < 0) this.x = this.size/2;
	if(this.x + (this.size/2) > canvas.width) this.x = canvas.width - (this.size/2);
}
bar.prototype.Draw = function(){
	ctx.fillRect(this.x - (this.size/2), this.y, this.size, 5);
}
bar.prototype.Collision = function(ball){
	if(this.x - (this.size/2) <= ball.x && this.x + (this.size/2) >= ball.x && this.y >= ball.y && this.y <= ball.y+ball.size){
		ball.vel.y *= -1;
		ball.y = this.y - ball.size;
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
//---------------------------------------------------------//
//---------------------------------------------------------//